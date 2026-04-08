"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword, type AuthResult } from "@/app/actions/auth";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, undefined);
  const [showPassword, setShowPassword] = useState(false);

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-3xl border shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-xl font-bold font-heading mb-2">
            Mật khẩu đã được đặt lại!
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Bạn có thể đăng nhập bằng mật khẩu mới.
          </p>
          <Button
            className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
            render={<Link href="/login" />}
          >
            Đăng nhập ngay
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
            <ShieldCheck className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Đặt lại mật khẩu</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Nhập mật khẩu mới cho tài khoản của bạn
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
            <Label htmlFor="password">Mật khẩu mới</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pl-10 pr-10 h-11 rounded-xl"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pl-10 h-11 rounded-xl"
                autoComplete="new-password"
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
                Đặt lại mật khẩu
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
