"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
  error?: string;
  success?: string;
};

// Detect if input is phone number (VN format)
function isPhoneNumber(input: string): boolean {
  return /^0[3-9]\d{8}$/.test(input.replace(/\s/g, ""));
}

// Format phone to E.164 for Supabase
function formatPhoneE164(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  return "+84" + cleaned.slice(1);
}

export async function login(
  _prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient();

  const identifier = (formData.get("identifier") as string)?.trim();
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Vui lòng nhập đầy đủ thông tin" };
  }

  let result;

  if (isPhoneNumber(identifier)) {
    result = await supabase.auth.signInWithPassword({
      phone: formatPhoneE164(identifier),
      password,
    });
  } else {
    result = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
  }

  if (result.error) {
    return { error: "Email/SĐT hoặc mật khẩu không đúng" };
  }

  redirect("/account");
}

export async function register(
  _prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (!name || name.length < 2) {
    return { error: "Họ tên phải có ít nhất 2 ký tự" };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Email không hợp lệ" };
  }
  if (phone && !isPhoneNumber(phone)) {
    return { error: "Số điện thoại không hợp lệ (VD: 0912345678)" };
  }
  if (!password || password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự" };
  }
  if (password !== confirmPassword) {
    return { error: "Mật khẩu xác nhận không khớp" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone: phone || undefined,
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Email này đã được đăng ký" };
    }
    return { error: error.message };
  }

  return {
    success:
      "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
  };
}

export async function forgotPassword(
  _prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient();
  const email = (formData.get("email") as string)?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Vui lòng nhập email hợp lệ" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : "http://localhost:3001"}/reset-password`,
  });

  if (error) {
    return { error: "Có lỗi xảy ra. Vui lòng thử lại." };
  }

  return {
    success: "Đã gửi link đặt lại mật khẩu đến email của bạn.",
  };
}

export async function resetPassword(
  _prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự" };
  }
  if (password !== confirmPassword) {
    return { error: "Mật khẩu xác nhận không khớp" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Có lỗi xảy ra. Vui lòng thử lại." };
  }

  return { success: "Đặt lại mật khẩu thành công!" };
}

export async function updateProfile(
  _prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!name || name.length < 2) {
    return { error: "Họ tên phải có ít nhất 2 ký tự" };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: name,
      phone: phone || undefined,
    },
  });

  if (error) {
    return { error: "Có lỗi xảy ra. Vui lòng thử lại." };
  }

  return { success: "Cập nhật thông tin thành công!" };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
