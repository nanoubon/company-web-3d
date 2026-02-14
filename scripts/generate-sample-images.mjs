import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function rngFactory(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return [mix(c1[0], c2[0], t), mix(c1[1], c2[1], t), mix(c1[2], c2[2], t)];
}

function createScene(width, height, fill = [0, 0, 0]) {
  const data = new Uint8ClampedArray(width * height * 3);
  for (let i = 0; i < width * height; i += 1) {
    const idx = i * 3;
    data[idx] = fill[0];
    data[idx + 1] = fill[1];
    data[idx + 2] = fill[2];
  }
  return { width, height, data };
}

function blendPixel(scene, x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= scene.width || y >= scene.height) {
    return;
  }

  const idx = (Math.floor(y) * scene.width + Math.floor(x)) * 3;
  const inv = 1 - alpha;
  scene.data[idx] = clamp(scene.data[idx] * inv + color[0] * alpha);
  scene.data[idx + 1] = clamp(scene.data[idx + 1] * inv + color[1] * alpha);
  scene.data[idx + 2] = clamp(scene.data[idx + 2] * inv + color[2] * alpha);
}

function fillVerticalGradient(scene, topColor, bottomColor, yStart = 0, yEnd = scene.height) {
  const start = Math.max(0, Math.floor(yStart));
  const end = Math.min(scene.height, Math.floor(yEnd));
  const span = Math.max(1, end - start);

  for (let y = start; y < end; y += 1) {
    const t = (y - start) / span;
    const color = lerpColor(topColor, bottomColor, t);
    for (let x = 0; x < scene.width; x += 1) {
      const idx = (y * scene.width + x) * 3;
      scene.data[idx] = clamp(color[0]);
      scene.data[idx + 1] = clamp(color[1]);
      scene.data[idx + 2] = clamp(color[2]);
    }
  }
}

function drawRect(scene, x, y, width, height, color, alpha = 1) {
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(scene.width, Math.floor(x + width));
  const endY = Math.min(scene.height, Math.floor(y + height));

  for (let py = startY; py < endY; py += 1) {
    for (let px = startX; px < endX; px += 1) {
      blendPixel(scene, px, py, color, alpha);
    }
  }
}

function drawVerticalGradientRect(scene, x, y, width, height, topColor, bottomColor, alpha = 1) {
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(scene.width, Math.floor(x + width));
  const endY = Math.min(scene.height, Math.floor(y + height));
  const span = Math.max(1, endY - startY);

  for (let py = startY; py < endY; py += 1) {
    const t = (py - startY) / span;
    const color = lerpColor(topColor, bottomColor, t);
    for (let px = startX; px < endX; px += 1) {
      blendPixel(scene, px, py, color, alpha);
    }
  }
}

function drawHorizontalGradientRect(scene, x, y, width, height, leftColor, rightColor, alpha = 1) {
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(scene.width, Math.floor(x + width));
  const endY = Math.min(scene.height, Math.floor(y + height));
  const span = Math.max(1, endX - startX);

  for (let px = startX; px < endX; px += 1) {
    const t = (px - startX) / span;
    const color = lerpColor(leftColor, rightColor, t);
    for (let py = startY; py < endY; py += 1) {
      blendPixel(scene, px, py, color, alpha);
    }
  }
}

function drawCircle(scene, cx, cy, radius, color, alpha = 1, softness = 0) {
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(scene.width - 1, Math.floor(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(scene.height - 1, Math.floor(cy + radius));
  const radiusSquared = radius * radius;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared > radiusSquared) {
        continue;
      }

      let localAlpha = alpha;
      if (softness > 0) {
        const distance = Math.sqrt(distanceSquared);
        const edge = 1 - distance / radius;
        localAlpha *= Math.pow(Math.max(0, edge), softness);
      }

      blendPixel(scene, x, y, color, localAlpha);
    }
  }
}

function drawEllipse(scene, cx, cy, rx, ry, color, alpha = 1, softness = 0) {
  const minX = Math.max(0, Math.floor(cx - rx));
  const maxX = Math.min(scene.width - 1, Math.floor(cx + rx));
  const minY = Math.max(0, Math.floor(cy - ry));
  const maxY = Math.min(scene.height - 1, Math.floor(cy + ry));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const distance = nx * nx + ny * ny;

      if (distance > 1) {
        continue;
      }

      let localAlpha = alpha;
      if (softness > 0) {
        const edge = 1 - Math.sqrt(distance);
        localAlpha *= Math.pow(Math.max(0, edge), softness);
      }

      blendPixel(scene, x, y, color, localAlpha);
    }
  }
}

function drawLine(scene, x1, y1, x2, y2, thickness, color, alpha = 1) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) {
    drawCircle(scene, x1, y1, thickness * 0.5, color, alpha, 0.2);
    return;
  }

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = mix(x1, x2, t);
    const y = mix(y1, y2, t);
    drawCircle(scene, x, y, thickness * 0.5, color, alpha, 0.1);
  }
}

function fillTriangle(scene, p1, p2, p3, color, alpha = 1) {
  const minX = Math.max(0, Math.floor(Math.min(p1[0], p2[0], p3[0])));
  const maxX = Math.min(scene.width - 1, Math.ceil(Math.max(p1[0], p2[0], p3[0])));
  const minY = Math.max(0, Math.floor(Math.min(p1[1], p2[1], p3[1])));
  const maxY = Math.min(scene.height - 1, Math.ceil(Math.max(p1[1], p2[1], p3[1])));

  const area = (ax, ay, bx, by, cx, cy) => (ax - cx) * (by - cy) - (bx - cx) * (ay - cy);
  const total = area(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
  if (total === 0) {
    return;
  }

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const w1 = area(x, y, p2[0], p2[1], p3[0], p3[1]) / total;
      const w2 = area(p1[0], p1[1], x, y, p3[0], p3[1]) / total;
      const w3 = area(p1[0], p1[1], p2[0], p2[1], x, y) / total;
      if (w1 >= 0 && w2 >= 0 && w3 >= 0) {
        blendPixel(scene, x, y, color, alpha);
      }
    }
  }
}

function fillQuad(scene, p1, p2, p3, p4, color, alpha = 1) {
  fillTriangle(scene, p1, p2, p3, color, alpha);
  fillTriangle(scene, p1, p3, p4, color, alpha);
}

function applyAreaTexture(scene, x, y, width, height, amount, rng) {
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(scene.width, Math.floor(x + width));
  const endY = Math.min(scene.height, Math.floor(y + height));

  for (let py = startY; py < endY; py += 1) {
    for (let px = startX; px < endX; px += 1) {
      const idx = (py * scene.width + px) * 3;
      const noise = (rng() - 0.5) * amount;
      scene.data[idx] = clamp(scene.data[idx] + noise);
      scene.data[idx + 1] = clamp(scene.data[idx + 1] + noise * 0.9);
      scene.data[idx + 2] = clamp(scene.data[idx + 2] + noise * 1.1);
    }
  }
}

function addFilmGrain(scene, amount, rng) {
  for (let i = 0; i < scene.data.length; i += 3) {
    const noise = (rng() - 0.5) * amount;
    scene.data[i] = clamp(scene.data[i] + noise);
    scene.data[i + 1] = clamp(scene.data[i + 1] + noise);
    scene.data[i + 2] = clamp(scene.data[i + 2] + noise);
  }
}

function blur3x3(scene, passes = 1) {
  const { width, height } = scene;
  const source = new Uint8ClampedArray(scene.data.length);

  for (let pass = 0; pass < passes; pass += 1) {
    source.set(scene.data);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const idx = (y * width + x) * 3;
        for (let channel = 0; channel < 3; channel += 1) {
          const a = source[idx - width * 3 - 3 + channel];
          const b = source[idx - width * 3 + channel];
          const c = source[idx - width * 3 + 3 + channel];
          const d = source[idx - 3 + channel];
          const e = source[idx + channel];
          const f = source[idx + 3 + channel];
          const g = source[idx + width * 3 - 3 + channel];
          const h = source[idx + width * 3 + channel];
          const i = source[idx + width * 3 + 3 + channel];
          scene.data[idx + channel] = (a + b + c + d + e + f + g + h + i) / 9;
        }
      }
    }
  }
}

function addVignette(scene, strength = 0.2) {
  const cx = scene.width * 0.5;
  const cy = scene.height * 0.5;
  const maxDistance = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < scene.height; y += 1) {
    for (let x = 0; x < scene.width; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy) / maxDistance;
      const shade = 1 - Math.pow(distance, 1.8) * strength;
      const idx = (y * scene.width + x) * 3;
      scene.data[idx] = clamp(scene.data[idx] * shade);
      scene.data[idx + 1] = clamp(scene.data[idx + 1] * shade);
      scene.data[idx + 2] = clamp(scene.data[idx + 2] * shade);
    }
  }
}

function drawCloud(scene, cx, cy, scale, alpha = 0.26) {
  drawEllipse(scene, cx, cy, 90 * scale, 35 * scale, [255, 255, 255], alpha, 2.1);
  drawEllipse(scene, cx - 60 * scale, cy + 8 * scale, 55 * scale, 28 * scale, [250, 253, 255], alpha * 0.86, 2.1);
  drawEllipse(scene, cx + 62 * scale, cy + 8 * scale, 60 * scale, 30 * scale, [248, 252, 255], alpha * 0.84, 2.1);
}

function drawCloudLayer(scene, rng, count, yMin, yMax) {
  for (let i = 0; i < count; i += 1) {
    const x = rng() * scene.width;
    const y = yMin + rng() * (yMax - yMin);
    const scale = 0.55 + rng() * 0.9;
    const alpha = 0.18 + rng() * 0.2;
    drawCloud(scene, x, y, scale, alpha);
  }
}

function drawSkyline(scene, rng, horizon, layerCount = 2) {
  for (let layer = 0; layer < layerCount; layer += 1) {
    let x = -20;
    const depth = layer / Math.max(1, layerCount - 1);
    const alpha = 0.28 + depth * 0.26;
    const toneA = lerpColor([134, 156, 179], [108, 132, 157], depth);
    const toneB = lerpColor([170, 193, 215], [125, 145, 168], depth);

    while (x < scene.width + 30) {
      const width = 24 + rng() * (36 + layer * 18);
      const height = 80 + rng() * (180 - layer * 30);
      drawVerticalGradientRect(
        scene,
        x,
        horizon - height,
        width,
        height,
        toneA,
        toneB,
        alpha
      );

      if (layer === 1 && rng() > 0.45) {
        const rows = 5 + Math.floor(rng() * 6);
        for (let row = 0; row < rows; row += 1) {
          const y = horizon - height + 12 + row * ((height - 20) / rows);
          drawRect(scene, x + 5, y, width - 10, 2, [192, 208, 224], alpha * 0.28);
        }
      }

      x += width + 8 + rng() * 16;
    }
  }
}

function drawTreeBand(scene, rng, baseY, count, spread) {
  for (let i = 0; i < count; i += 1) {
    const x = (i / count) * scene.width + (rng() - 0.5) * spread;
    const radius = 24 + rng() * 34;
    const color = lerpColor([57, 99, 56], [38, 73, 40], rng());
    drawCircle(scene, x, baseY + rng() * 12, radius, color, 0.75, 1.4);
    drawCircle(scene, x + radius * 0.3, baseY + 4, radius * 0.72, [70, 112, 64], 0.4, 1.2);
  }
}

function drawWorker(scene, x, y, scale, vestColor) {
  drawEllipse(scene, x, y - 18 * scale, 11 * scale, 14 * scale, [233, 196, 165], 0.95, 0.8);
  drawRect(scene, x - 12 * scale, y - 34 * scale, 24 * scale, 7 * scale, [246, 180, 52], 0.96);
  drawRect(scene, x - 13 * scale, y - 7 * scale, 26 * scale, 26 * scale, [43, 58, 78], 0.95);
  drawRect(scene, x - 14 * scale, y - 4 * scale, 28 * scale, 13 * scale, vestColor, 0.9);
  drawRect(scene, x - 9 * scale, y + 18 * scale, 7 * scale, 16 * scale, [30, 39, 50], 0.95);
  drawRect(scene, x + 2 * scale, y + 18 * scale, 7 * scale, 16 * scale, [30, 39, 50], 0.95);
  drawEllipse(scene, x, y + 36 * scale, 16 * scale, 5 * scale, [70, 56, 44], 0.35, 1.0);
}

function drawConstructionHero(scene, rng) {
  const horizon = 510;

  fillVerticalGradient(scene, [94, 155, 230], [201, 226, 248]);
  drawCircle(scene, 1260, 205, 170, [255, 220, 158], 0.35, 2.1);
  drawCloudLayer(scene, rng, 10, 90, 270);

  drawSkyline(scene, rng, horizon - 38, 2);
  drawTreeBand(scene, rng, horizon + 6, 120, 28);

  drawHorizontalGradientRect(scene, 0, horizon + 24, scene.width, 40, [89, 131, 75], [64, 99, 58], 0.96);
  drawVerticalGradientRect(scene, 0, horizon + 56, scene.width, scene.height - (horizon + 56), [205, 175, 137], [165, 134, 100], 0.98);
  applyAreaTexture(scene, 0, horizon + 56, scene.width, 340, 14, rng);

  // Main unfinished building body
  const baseX = 800;
  const baseY = 580;
  for (let floor = 0; floor < 8; floor += 1) {
    const w = 560 - floor * 48;
    const h = 40;
    const y = baseY - floor * 43;
    const left = baseX - w * 0.5;
    const concreteTop = lerpColor([193, 193, 188], [170, 168, 162], floor / 8);
    const concreteBottom = lerpColor([148, 147, 143], [125, 123, 119], floor / 8);

    drawVerticalGradientRect(scene, left, y, w, h, concreteTop, concreteBottom, 0.98);
    drawRect(scene, left, y + h - 4, w, 4, [99, 97, 93], 0.58);

    const bayCount = 7;
    for (let bay = 0; bay < bayCount; bay += 1) {
      const bx = left + 22 + bay * ((w - 44) / bayCount);
      const bw = (w - 44) / bayCount - 10;
      drawVerticalGradientRect(scene, bx, y + 8, bw, h - 14, [98, 101, 108], [53, 58, 66], 0.76);
      drawRect(scene, bx + 2, y + 11, bw - 4, 2, [176, 182, 190], 0.46);
    }

    for (let col = 0; col < 8; col += 1) {
      const cx = left + 18 + col * ((w - 36) / 8);
      drawRect(scene, cx, y - 3, 5, h + 8, [128, 127, 122], 0.68);
    }
  }

  // Glass side tower
  drawVerticalGradientRect(scene, 940, 344, 200, 280, [151, 191, 223], [80, 126, 166], 0.98);
  for (let row = 0; row < 12; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const wx = 955 + col * 45;
      const wy = 360 + row * 22;
      drawRect(scene, wx, wy, 34, 14, [192, 216, 234], 0.66);
      if ((row + col) % 3 === 0) {
        drawRect(scene, wx, wy, 34, 14, [133, 169, 197], 0.32);
      }
    }
  }

  // Rebar and top detail
  for (let i = 0; i < 8; i += 1) {
    const x = 706 + i * 18;
    drawLine(scene, x, 260, x, 206, 3, [77, 81, 86], 0.84);
    drawLine(scene, x, 238, x + 12, 238, 2, [95, 98, 104], 0.66);
  }

  // Scaffold left
  for (let i = 0; i < 6; i += 1) {
    const y = 360 + i * 36;
    drawLine(scene, 548, y, 652, y, 3, [131, 139, 148], 0.8);
  }
  for (let i = 0; i < 5; i += 1) {
    const x = 558 + i * 22;
    drawLine(scene, x, 355, x, 548, 2.6, [120, 130, 141], 0.78);
  }

  // Crane mast and jib
  drawVerticalGradientRect(scene, 1080, 150, 34, 520, [240, 165, 35], [204, 131, 22], 0.96);
  for (let i = 0; i < 20; i += 1) {
    const y = 170 + i * 24;
    drawRect(scene, 1075, y, 44, 3, [170, 109, 18], 0.58);
  }

  drawHorizontalGradientRect(scene, 860, 130, 510, 18, [245, 178, 50], [218, 143, 31], 0.97);
  for (let i = 0; i < 22; i += 1) {
    const x = 868 + i * 22;
    drawLine(scene, x, 130, x + 20, 148, 2, [228, 156, 38], 0.72);
    drawLine(scene, x + 20, 130, x, 148, 2, [207, 135, 26], 0.72);
  }

  drawLine(scene, 1110, 150, 1310, 124, 2, [69, 82, 97], 0.7);
  drawLine(scene, 1110, 150, 1230, 262, 2, [76, 88, 101], 0.7);
  drawLine(scene, 1110, 150, 1030, 260, 2, [76, 88, 101], 0.7);

  drawLine(scene, 1202, 152, 1202, 312, 3, [48, 58, 69], 0.8);
  drawRect(scene, 1164, 312, 76, 54, [205, 215, 223], 0.96);
  drawRect(scene, 1168, 316, 68, 4, [167, 178, 188], 0.82);

  // Foreground props and containers
  const props = [
    [556, 612, 126, 55, [153, 102, 64]],
    [686, 622, 158, 58, [171, 117, 73]],
    [856, 606, 152, 62, [188, 141, 95]],
    [1008, 618, 138, 50, [159, 106, 66]],
    [1160, 614, 164, 52, [177, 120, 74]],
    [460, 660, 186, 62, [141, 98, 59]],
    [1260, 658, 176, 58, [155, 104, 63]]
  ];

  for (const prop of props) {
    const [x, y, w, h, color] = prop;
    drawVerticalGradientRect(scene, x, y, w, h, color, [color[0] - 18, color[1] - 16, color[2] - 15], 0.95);
    applyAreaTexture(scene, x, y, w, h, 10, rng);
  }

  // Excavation cut and road strip
  fillQuad(scene, [120, 660], [420, 620], [510, 680], [100, 732], [128, 100, 73], 0.9);
  drawHorizontalGradientRect(scene, 0, 736, scene.width, 78, [178, 157, 129], [157, 138, 112], 0.95);

  // Tiny site workers
  drawWorker(scene, 660, 640, 1.05, [246, 122, 46]);
  drawWorker(scene, 730, 636, 0.96, [240, 171, 57]);
  drawWorker(scene, 1188, 708, 0.94, [240, 122, 44]);

  // Atmospheric haze and lens warmth
  drawEllipse(scene, 1280, 260, 300, 230, [255, 206, 162], 0.14, 1.8);
  drawRect(scene, 0, 0, scene.width, scene.height, [154, 176, 202], 0.06);
}

function drawVilla(scene, rng) {
  const horizon = 560;

  fillVerticalGradient(scene, [90, 112, 177], [246, 184, 138]);
  drawCircle(scene, 1120, 236, 180, [255, 182, 132], 0.28, 2.0);
  drawCloudLayer(scene, rng, 9, 90, 240);

  drawSkyline(scene, rng, horizon - 28, 1);
  drawTreeBand(scene, rng, horizon + 4, 90, 24);

  drawVerticalGradientRect(scene, 0, horizon + 20, scene.width, scene.height - (horizon + 20), [66, 113, 61], [39, 66, 38], 0.97);
  drawHorizontalGradientRect(scene, 260, 655, 1080, 130, [58, 67, 78], [52, 64, 74], 0.74);
  drawRect(scene, 280, 650, 1040, 6, [142, 152, 163], 0.36);

  // Main villa body with depth
  drawVerticalGradientRect(scene, 410, 390, 760, 320, [248, 244, 236], [220, 210, 195], 0.98);
  drawVerticalGradientRect(scene, 500, 305, 580, 110, [248, 244, 236], [228, 216, 202], 0.98);
  fillQuad(scene, [440, 390], [790, 205], [1160, 390], [1030, 390], [54, 71, 95], 0.97);
  fillQuad(scene, [520, 305], [790, 198], [1060, 305], [970, 305], [64, 81, 106], 0.95);

  // Window grid with warm interior
  const warmOn = [248, 183, 95];
  const warmDim = [171, 128, 74];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const x = 470 + col * 168;
      const y = 460 + row * 135;
      drawVerticalGradientRect(scene, x, y, 108, 92, warmOn, warmDim, 0.89);
      drawRect(scene, x, y, 108, 6, [255, 227, 165], 0.22);
    }
  }

  for (let col = 0; col < 4; col += 1) {
    const x = 540 + col * 128;
    drawVerticalGradientRect(scene, x, 330, 88, 62, [248, 188, 104], [178, 134, 76], 0.86);
  }

  // Entrance and trim
  drawVerticalGradientRect(scene, 730, 545, 132, 165, [93, 72, 56], [59, 44, 34], 0.95);
  drawRect(scene, 408, 415, 764, 12, [224, 214, 199], 0.75);
  drawRect(scene, 410, 705, 760, 10, [162, 150, 132], 0.58);

  // Landscape and lighting pools
  drawEllipse(scene, 325, 710, 132, 68, [40, 79, 44], 0.82, 1.3);
  drawEllipse(scene, 1240, 704, 146, 74, [40, 77, 43], 0.84, 1.3);
  drawEllipse(scene, 560, 690, 60, 24, [255, 196, 122], 0.22, 1.0);
  drawEllipse(scene, 1000, 690, 60, 24, [255, 196, 122], 0.22, 1.0);

  applyAreaTexture(scene, 0, horizon + 20, scene.width, scene.height - (horizon + 20), 10, rng);
  drawRect(scene, 0, 0, scene.width, scene.height, [141, 124, 134], 0.05);
}

function drawWarehouse(scene, rng) {
  const horizon = 550;

  fillVerticalGradient(scene, [117, 170, 223], [224, 237, 248]);
  drawCircle(scene, 1240, 210, 160, [255, 226, 181], 0.2, 2.0);
  drawCloudLayer(scene, rng, 10, 80, 250);
  drawSkyline(scene, rng, horizon - 30, 1);

  drawVerticalGradientRect(scene, 0, horizon + 30, scene.width, scene.height - (horizon + 30), [201, 183, 156], [157, 138, 112], 0.98);
  applyAreaTexture(scene, 0, horizon + 30, scene.width, scene.height - (horizon + 30), 11, rng);

  // Warehouse with perspective roof
  fillQuad(scene, [270, 390], [900, 300], [1260, 390], [620, 470], [189, 199, 210], 0.98);
  drawVerticalGradientRect(scene, 285, 390, 980, 300, [225, 230, 236], [188, 196, 204], 0.98);
  drawRect(scene, 310, 430, 930, 58, [146, 166, 186], 0.9);
  drawRect(scene, 310, 430, 930, 6, [118, 137, 156], 0.8);

  // Loading docks
  for (let bay = 0; bay < 5; bay += 1) {
    const x = 370 + bay * 175;
    drawVerticalGradientRect(scene, x, 520, 140, 170, [126, 137, 149], [100, 110, 122], 0.94);
    drawVerticalGradientRect(scene, x + 22, 548, 96, 120, [52, 66, 81], [35, 46, 58], 0.96);
    drawRect(scene, x + 18, 544, 104, 4, [198, 210, 222], 0.34);
  }

  // Trucks and pallets
  drawVerticalGradientRect(scene, 1110, 612, 220, 76, [243, 167, 83], [212, 135, 58], 0.96);
  drawVerticalGradientRect(scene, 1010, 612, 112, 56, [94, 110, 128], [63, 76, 92], 0.95);
  drawRect(scene, 1025, 656, 16, 16, [28, 36, 44], 0.96);
  drawRect(scene, 1080, 656, 16, 16, [28, 36, 44], 0.96);

  for (let i = 0; i < 5; i += 1) {
    drawVerticalGradientRect(scene, 240 + i * 78, 710 - i * 4, 62, 34, [154, 111, 72], [126, 88, 57], 0.92);
  }

  drawRect(scene, 210, 706, 1080, 56, [163, 145, 121], 0.74);
  drawLine(scene, 1288, 400, 1288, 690, 4, [121, 132, 143], 0.8);
  drawRect(scene, 1262, 394, 52, 12, [236, 165, 84], 0.92);

  drawRect(scene, 0, 0, scene.width, scene.height, [142, 158, 173], 0.05);
}

function drawAbout(scene, rng) {
  const horizon = 500;

  fillVerticalGradient(scene, [94, 153, 219], [204, 228, 247]);
  drawCloudLayer(scene, rng, 9, 80, 220);
  drawSkyline(scene, rng, horizon - 34, 1);
  drawTreeBand(scene, rng, horizon + 6, 90, 20);

  drawVerticalGradientRect(scene, 0, horizon + 40, scene.width, scene.height - (horizon + 40), [193, 160, 124], [153, 121, 90], 0.96);
  applyAreaTexture(scene, 0, horizon + 40, scene.width, scene.height - (horizon + 40), 11, rng);

  // Crane in background
  drawVerticalGradientRect(scene, 1120, 220, 22, 320, [237, 163, 40], [201, 128, 23], 0.9);
  drawHorizontalGradientRect(scene, 980, 210, 260, 12, [238, 170, 47], [214, 142, 32], 0.9);

  // Foreground workers (more detailed shapes)
  // Worker A
  drawEllipse(scene, 680, 505, 64, 84, [233, 198, 166], 0.95, 1.1);
  drawEllipse(scene, 680, 474, 48, 38, [243, 207, 174], 0.95, 1.1);
  drawEllipse(scene, 680, 445, 52, 20, [246, 192, 56], 0.95, 0.9);
  drawVerticalGradientRect(scene, 605, 528, 150, 250, [86, 96, 112], [60, 68, 80], 0.96);
  drawVerticalGradientRect(scene, 606, 526, 152, 142, [244, 122, 55], [220, 94, 39], 0.92);
  drawRect(scene, 646, 558, 14, 104, [238, 233, 220], 0.58);
  drawRect(scene, 700, 558, 14, 104, [238, 233, 220], 0.58);

  // Worker B
  drawEllipse(scene, 870, 495, 68, 88, [224, 188, 156], 0.95, 1.1);
  drawEllipse(scene, 870, 464, 50, 38, [236, 196, 165], 0.95, 1.1);
  drawEllipse(scene, 870, 434, 54, 22, [245, 246, 248], 0.95, 1.0);
  drawVerticalGradientRect(scene, 790, 520, 170, 272, [74, 84, 102], [54, 61, 76], 0.96);
  drawVerticalGradientRect(scene, 790, 520, 170, 160, [167, 219, 86], [131, 183, 66], 0.92);
  drawRect(scene, 840, 554, 14, 112, [230, 240, 224], 0.55);
  drawRect(scene, 900, 554, 14, 112, [230, 240, 224], 0.55);

  // Blueprint sheet and hands
  fillQuad(scene, [640, 700], [980, 732], [954, 860], [620, 830], [229, 237, 243], 0.95);
  drawLine(scene, 664, 744, 944, 768, 3, [148, 166, 185], 0.54);
  drawLine(scene, 660, 778, 928, 801, 3, [148, 166, 185], 0.54);
  drawLine(scene, 654, 812, 906, 834, 3, [148, 166, 185], 0.54);

  drawEllipse(scene, 760, 708, 28, 18, [220, 185, 154], 0.88, 1.0);
  drawEllipse(scene, 836, 716, 30, 18, [214, 178, 147], 0.88, 1.0);

  drawRect(scene, 0, 0, scene.width, scene.height, [145, 166, 186], 0.06);
  blur3x3(scene, 1);
}

function writeSceneToPpm(scene, path) {
  const header = `P6\n${scene.width} ${scene.height}\n255\n`;
  const output = Buffer.alloc(Buffer.byteLength(header) + scene.data.length);
  output.write(header, 0, 'ascii');
  Buffer.from(scene.data).copy(output, Buffer.byteLength(header));
  writeFileSync(path, output);
}

function writeSceneAsJpeg(scene, outputPath) {
  const tempDir = join(process.cwd(), '.tmp-image-gen');
  mkdirSync(tempDir, { recursive: true });
  const ppmPath = join(tempDir, 'temp.ppm');
  writeSceneToPpm(scene, ppmPath);
  execFileSync('sips', ['-s', 'format', 'jpeg', ppmPath, '--out', outputPath], { stdio: 'ignore' });
}

function renderAndWrite(buildFn, seed, outputPath) {
  const scene = createScene(1600, 900);
  const rng = rngFactory(seed);
  buildFn(scene, rng);
  addFilmGrain(scene, 10, rng);
  addVignette(scene, 0.22);
  blur3x3(scene, 1);
  writeSceneAsJpeg(scene, outputPath);
}

function main() {
  const outputDir = join(process.cwd(), 'public', 'images');
  mkdirSync(outputDir, { recursive: true });

  renderAndWrite(drawConstructionHero, 101, join(outputDir, 'project-office.jpg'));
  renderAndWrite(drawVilla, 202, join(outputDir, 'project-villa.jpg'));
  renderAndWrite(drawWarehouse, 303, join(outputDir, 'project-warehouse.jpg'));
  renderAndWrite(drawAbout, 404, join(outputDir, 'about-team.jpg'));

  rmSync(join(process.cwd(), '.tmp-image-gen'), { recursive: true, force: true });
}

main();
