import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F7377" },
    { media: "(prefers-color-scheme: dark)", color: "#0C5C5F" },
  ],
};

export const metadata: Metadata = {
  title: "GrowthLab Events - Event Management & Ticketing",
  description: "Create, manage, and sell tickets for your events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-slate-900 transition-colors duration-200`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  // Default to light mode, only use dark if explicitly set
                  const shouldBeDark = theme === 'dark';
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>
          <div className="app-shell min-h-[100dvh] flex flex-col overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
