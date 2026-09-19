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
          colorPrimary: "#171717",
          borderRadius: "0.625rem",
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      >
        <body className="min-h-full flex flex-col">
          <header className="flex h-14 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                conductor-demo
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Show when="signed-in">
                <Link
                  href="/admin"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Admin
                </Link>
              </Show>
            </div>
            <div className="flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Sign up</Button>
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
