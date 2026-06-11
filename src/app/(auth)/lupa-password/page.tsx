"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPassword } from "@/actions/auth";
import { Mail } from "lucide-react";

export default function LupaPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await forgotPassword(formData);
      if (result.success) {
        setSent(true);
      } else {
        toast.error(result.error);
      }
    });
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="rounded-full bg-primary-50 p-4">
              <Mail className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Email terkirim!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Cek inbox kamu dan klik link untuk reset password.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/masuk">Kembali ke halaman masuk</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email kamu dan kami akan mengirim link untuk reset password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/masuk" className="text-primary-600 hover:underline">
            Kembali ke halaman masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
