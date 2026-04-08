"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register, type AuthResult } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // Password strength
  const checks = [
    { label: "Ít nhất 6 ký tự", valid: password.length >= 6 },
    { label: "Có chữ cái", valid: /[a-zA-Z]/.test(password) },
    { label: "Có số", valid: /[0-9]/.test(password) },
  ];
  const strengthPercent =
    password.length === 0
      ? 0
      : (checks.filter((c) => c.valid).length / checks.length) * 100;

  // Success state
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
            Đăng ký thành công!
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {state.success}
          </p>
          <Button
            className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
            render={<Link href="/login" />}
          >
            Đi đến trang đăng nhập
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Tạo tài khoản</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tham gia ShopVN để mua sắm dễ dàng hơn
          </p>
        </div>

        {/* Error */}
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
        <form action={formAction} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <div className="relative mt-1.5">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="Nguyễn Văn A"
                required
                className="pl-10 h-11 rounded-xl"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div>
            <Label htmlFor="phone">
              Số điện thoại{" "}
              <span className="text-muted-foreground font-normal">
                (không bắt buộc)
              </span>
            </Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0912345678"
                className="pl-10 h-11 rounded-xl"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {/* Strength meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        strengthPercent === 100
                          ? "oklch(0.72 0.19 155)"
                          : strengthPercent >= 66
                          ? "oklch(0.8 0.16 85)"
                          : "oklch(0.635 0.2 18)",
                    }}
                    animate={{ width: `${strengthPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {checks.map((c) => (
                    <span
                      key={c.label}
                      className={`text-[10px] flex items-center gap-1 ${
                        c.valid
                          ? "text-success"
                          : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
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

          {/* Submit */}
          <Button
            type="submit"
            disabled={pending}
            className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-sm gap-2 mt-2"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Tạo tài khoản
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
