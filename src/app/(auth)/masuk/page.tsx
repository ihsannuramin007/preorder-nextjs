"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login, loginWithGoogle } from "@/actions/auth";

export default function MasukPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [googlePending, setGooglePending] = useState(false);

  function handleLogin(formData: FormData) {
    startTransition(async () => {
      const result = await login(formData);
      if (result && !result.success) {
        toast.error(result.error);
      }
    });
  }

  async function handleGoogleLogin() {
    setGooglePending(true);
    const result = await loginWithGoogle();
    if (result.success) {
      window.location.href = result.data.url;
    } else {
      toast.error(result.error);
      setGooglePending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Masuk ke Akun</CardTitle>
        <CardDescription>Masukkan email dan password kamu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={googlePending}
          type="button"
        >
          {googlePending ? "Mengalihkan..." : "Masuk dengan Google"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">atau</span>
          </div>
        </div>

        <form action={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="kamu@email.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/lupa-password"
                className="text-xs text-primary-600 hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/daftar" className="text-primary-600 font-medium hover:underline">
            Daftar gratis
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
