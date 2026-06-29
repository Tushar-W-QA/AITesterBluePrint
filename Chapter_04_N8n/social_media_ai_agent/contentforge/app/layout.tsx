import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/context/ThemeContext";

export const metadata: Metadata = {
  title: "ContentBuddy — AI Content Pipeline",
  description: "Your AI-powered content creation companion by Tushar Warad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('cb-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
