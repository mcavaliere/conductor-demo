import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sign in",
  description: "Authentication powered by Clerk",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00ff9c",
          colorBackground: "#0a1410",
          colorInputText: "#e6fff2",
          colorText: "#e6fff2",
          colorTextSecondary: "#8fb8a5",
          colorNeutral: "#00ff9c",
          borderRadius: "0.625rem",
        },
        elements: {
          card: "border border-[#00ff9c33] shadow-[0_0_60px_-20px_#00ff9c]",
          formButtonPrimary:
            "shadow-[0_0_18px_-2px_#00ff9c] hover:shadow-[0_0_28px_0_#00ff9c]",
        },
      }}
    >
      <html
        lang="en"
        className={cn("dark", "h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/70 px-6 backdrop-blur-md">
            <Link
              href="/"
              className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
            >
              <span className="inline-block size-2 rounded-full bg-primary shadow-[0_0_10px_var(--neon)] transition-transform group-hover:scale-125" />
              <span>
                conductor<span className="neon-text">-demo</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="neon-glow">
                    Sign up
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
