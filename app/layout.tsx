import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import './styles/post.css';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/utils/cn';
import { Provider as TooltipProvider } from '@/components/ui/tooltip';
import { NotificationProvider } from '@/components/ui/notification-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';

const inter = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = localFont({
  src: './fonts/GeistMono[wght].woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Z1 | Experience of Life',
  description: '...',
  icons: {
    icon: '/images/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(inter.variable, geistMono.variable, 'antialiased')}
    >
      <body className='bg-white p-[24px] sm:p-[12px]'>
        <ThemeProvider attribute='class'>
          <TooltipProvider>
            <div className='flex min-h-screen flex-col'>
              <Header />
              <main className='flex flex-1 flex-col'>{children}</main>
              <Footer />
            </div>
          </TooltipProvider>
        </ThemeProvider>
        <NotificationProvider />
      </body>
    </html>
  );
}
