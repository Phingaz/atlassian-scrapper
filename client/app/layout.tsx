import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { MainCtxProvider } from "./_context/Main";
import { ThemeProvider } from "./_context/ThemeProvider";
import { featureFlag } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Atlassian Community Scrapper",
  description:
    "Scrapes the Atlassian Community for data via the specified keywords and date range.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider enableSystem attribute="class" defaultTheme="system">
          <MainCtxProvider features={featureFlag}>{children}</MainCtxProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
