"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Errors = {
  email?: string;
  password?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // Simulate an auth request.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSignedIn(true);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {signedIn ? (
          <div
            role="status"
            className="rounded-lg border border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground"
          >
            Signed in as{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </div>
        ) : (
          <form
            id="sign-in-form"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email ? (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className="pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={cn(
                    "absolute inset-y-0 right-0 flex items-center px-3",
                    "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password}
                </p>
              ) : null}
            </div>
          </form>
        )}
      </CardContent>
      {signedIn ? (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSignedIn(false);
              setEmail("");
              setPassword("");
              setErrors({});
            }}
          >
            Sign out
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="flex-col gap-3">
          <Button
            type="submit"
            form="sign-in-form"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-medium text-foreground hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
