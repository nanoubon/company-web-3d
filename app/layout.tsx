import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elevate Build Construction',
  description: 'Professional construction solutions and modern engineering projects.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
