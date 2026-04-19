import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Z1 CMS',
  description: 'Payload CMS for Z1 content',
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
