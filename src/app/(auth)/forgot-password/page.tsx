"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, type AuthResult } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, undefined);

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-3xl border shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-xl font-bold font-heading mb-2">
            Kiểm tra email của bạn
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {state.success}
          </p>
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href="/login" />}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Quay lại đăng nhập
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="bg-card rounded-3xl border shadow-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Quên mật khẩu</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        {state?.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
          >
            {state.error}
          </motion.div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                className="pl-10 h-11 rounded-xl"
                autoComplete="email"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-sm gap-2"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Gửi link đặt lại
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link
            href="/login"
            className="text-accent hover:underline font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
