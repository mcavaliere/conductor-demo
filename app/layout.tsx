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
import { ThemeToggle } from "@/components/theme-toggle";

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

// Applied before paint to avoid a flash of the wrong theme. Honors a stored
// choice, else falls back to the OS preference.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00d47e",
          borderRadius: "0.625rem",
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      >
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        </head>
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/70 px-6 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
              >
                <span className="inline-block size-2 rounded-full bg-primary shadow-[0_0_10px_var(--neon)] transition-transform group-hover:scale-125" />
                <span>
                  conductor<span className="neon-text">-demo</span>
                </span>
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Blog
                </Link>
                <Show when="signed-in">
                  <Link
                    href="/admin"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Admin
                  </Link>
                </Show>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
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
