
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { CurrencyProvider } from '@/contexts/currency-context';

export const metadata: Metadata = {
  title: 'Livestock Lynx',
  description: 'Manage your farm with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CurrencyProvider>
            {children}
            <Toaster />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
