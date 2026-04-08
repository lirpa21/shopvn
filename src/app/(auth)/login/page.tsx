"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, Eye, EyeOff, LogIn, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type AuthResult } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="bg-card rounded-3xl border shadow-xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Đăng nhập</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chào mừng bạn quay lại ShopVN
          </p>
        </div>

        {/* Error Message */}
        {state?.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
          >
            {state.error}
          </motion.div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
          {/* Email / Phone */}
          <div>
            <Label htmlFor="identifier" className="text-sm font-medium">
              Email hoặc Số điện thoại
            </Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="email@example.com hoặc 0912345678"
                required
                className="pl-10 h-11 rounded-xl"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-accent hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pl-10 pr-10 h-11 rounded-xl"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={pending}
            className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-sm gap-2"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Đăng nhập
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted-foreground">
              Chưa có tài khoản?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl font-medium text-sm"
          render={<Link href="/register" />}
        >
          Tạo tài khoản mới
        </Button>
      </div>
    </motion.div>
  );
}
