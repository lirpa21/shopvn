/**
 * Payment Gateway Integration Service
 *
 * Supports:
 * - VNPay (set VNPAY_TMN_CODE, VNPAY_HASH_SECRET in .env.local)
 * - MoMo (set MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY in .env.local)
 * - COD (no API needed)
 * - Fallback: simulated payment (development mode)
 *
 * Environment Variables:
 *   # VNPay
 *   VNPAY_TMN_CODE=your_terminal_code
 *   VNPAY_HASH_SECRET=your_hash_secret
 *   VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
 *   VNPAY_RETURN_URL=http://localhost:3001/api/payment/vnpay/return
 *
 *   # MoMo
 *   MOMO_PARTNER_CODE=your_partner_code
 *   MOMO_ACCESS_KEY=your_access_key
 *   MOMO_SECRET_KEY=your_secret_key
 *   MOMO_API_URL=https://test-payment.momo.vn/v2/gateway/api
 */

import crypto from "crypto";

// ===================== TYPES =====================

export interface PaymentRequest {
  orderId: string;
  amount: number; // VND
  orderInfo: string;
  customerEmail?: string;
  customerName?: string;
  returnUrl?: string;
  ipAddress?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentUrl?: string; // Redirect URL for online payment
  transactionId?: string;
  message?: string;
  error?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  orderId: string;
  amount: number;
  transactionId: string;
  paymentMethod: string;
  message?: string;
}

export type PaymentMethodId =
  | "cod"
  | "vnpay"
  | "momo"
  | "shopeepay"
  | "zalopay"
  | "bank_qr";

// ===================== CONFIG CHECK =====================

export function isVNPayConfigured(): boolean {
  return !!(process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET);
}

export function isMoMoConfigured(): boolean {
  return !!(
    process.env.MOMO_PARTNER_CODE &&
    process.env.MOMO_ACCESS_KEY &&
    process.env.MOMO_SECRET_KEY
  );
}

// ===================== VNPAY =====================

export function createVNPayPayment(request: PaymentRequest): PaymentResult {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const vnpUrl =
    process.env.VNPAY_URL ||
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl =
    request.returnUrl ||
    process.env.VNPAY_RETURN_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/payment/vnpay/return`;

  if (!tmnCode || !secretKey) {
    // Fallback: simulate payment in dev
    console.log("[VNPay] Not configured — simulating payment");
    return {
      success: true,
      paymentUrl: `/checkout/success?simulated=true&orderId=${request.orderId}`,
      message: "Simulated VNPay payment (no credentials configured)",
    };
  }

  const date = new Date();
  const createDate = formatVNPayDate(date);
  const expireDate = formatVNPayDate(
    new Date(date.getTime() + 15 * 60 * 1000)
  ); // +15 min

  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: request.orderId,
    vnp_OrderInfo: request.orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: String(request.amount * 100), // VNPay expects amount * 100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: request.ipAddress || "127.0.0.1",
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  // Sort params and create query string
  const sortedParams = sortObject(params);
  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;

  return {
    success: true,
    paymentUrl,
    transactionId: request.orderId,
  };
}

export function verifyVNPayReturn(
  query: Record<string, string>
): PaymentVerifyResult {
  const secretKey = process.env.VNPAY_HASH_SECRET;

  if (!secretKey) {
    return {
      success: true,
      orderId: query.vnp_TxnRef || "",
      amount: Number(query.vnp_Amount || 0) / 100,
      transactionId: query.vnp_TransactionNo || "simulated",
      paymentMethod: "vnpay",
      message: "Simulated verification (no credentials)",
    };
  }

  const secureHash = query.vnp_SecureHash;

  // Remove hash fields for verification
  const verifyParams = { ...query };
  delete verifyParams.vnp_SecureHash;
  delete verifyParams.vnp_SecureHashType;

  const sortedParams = sortObject(verifyParams);
  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", secretKey);
  const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash !== checkSum) {
    return {
      success: false,
      orderId: query.vnp_TxnRef || "",
      amount: 0,
      transactionId: "",
      paymentMethod: "vnpay",
      message: "Invalid signature",
    };
  }

  const responseCode = query.vnp_ResponseCode;
  return {
    success: responseCode === "00",
    orderId: query.vnp_TxnRef || "",
    amount: Number(query.vnp_Amount || 0) / 100,
    transactionId: query.vnp_TransactionNo || "",
    paymentMethod: "vnpay",
    message:
      responseCode === "00"
        ? "Thanh toán thành công"
        : `Thanh toán thất bại (mã: ${responseCode})`,
  };
}

// ===================== MOMO =====================

export async function createMoMoPayment(
  request: PaymentRequest
): Promise<PaymentResult> {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const apiUrl =
    process.env.MOMO_API_URL ||
    "https://test-payment.momo.vn/v2/gateway/api/create";

  if (!partnerCode || !accessKey || !secretKey) {
    console.log("[MoMo] Not configured — simulating payment");
    return {
      success: true,
      paymentUrl: `/checkout/success?simulated=true&orderId=${request.orderId}`,
      message: "Simulated MoMo payment (no credentials configured)",
    };
  }

  const returnUrl =
    request.returnUrl ||
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/payment/momo/return`;
  const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/payment/momo/ipn`;
  const requestId = `${partnerCode}_${Date.now()}`;
  const extraData = "";

  // Create signature
  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${request.amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${request.orderId}`,
    `orderInfo=${request.orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${returnUrl}`,
    `requestId=${requestId}`,
    `requestType=payWithMethod`,
  ].join("&");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode,
    partnerName: "ShopVN",
    storeId: "ShopVN_Store",
    requestId,
    amount: request.amount,
    orderId: request.orderId,
    orderInfo: request.orderInfo,
    redirectUrl: returnUrl,
    ipnUrl,
    lang: "vi",
    requestType: "payWithMethod",
    autoCapture: true,
    extraData,
    signature,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.resultCode === 0) {
      return {
        success: true,
        paymentUrl: data.payUrl,
        transactionId: data.requestId,
      };
    }

    return {
      success: false,
      error: data.message || `MoMo error: ${data.resultCode}`,
    };
  } catch (error) {
    console.error("[MoMo] API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "MoMo API error",
    };
  }
}

export function verifyMoMoReturn(
  query: Record<string, string>
): PaymentVerifyResult {
  const secretKey = process.env.MOMO_SECRET_KEY;

  if (!secretKey) {
    return {
      success: true,
      orderId: query.orderId || "",
      amount: Number(query.amount || 0),
      transactionId: query.requestId || "simulated",
      paymentMethod: "momo",
      message: "Simulated verification",
    };
  }

  const resultCode = query.resultCode;

  return {
    success: resultCode === "0",
    orderId: query.orderId || "",
    amount: Number(query.amount || 0),
    transactionId: query.transId || "",
    paymentMethod: "momo",
    message:
      resultCode === "0"
        ? "Thanh toán thành công"
        : `Thanh toán thất bại (mã: ${resultCode})`,
  };
}

// ===================== UNIFIED PAYMENT =====================

export async function createPayment(
  method: PaymentMethodId,
  request: PaymentRequest
): Promise<PaymentResult> {
  switch (method) {
    case "cod":
      return {
        success: true,
        transactionId: `COD_${request.orderId}`,
        message: "Đơn hàng COD — thanh toán khi nhận hàng",
      };

    case "vnpay":
      return createVNPayPayment(request);

    case "momo":
      return await createMoMoPayment(request);

    case "bank_qr":
      // Bank QR uses VNPay gateway with bank method
      return createVNPayPayment({
        ...request,
        orderInfo: `[QR] ${request.orderInfo}`,
      });

    case "shopeepay":
    case "zalopay":
      // These require separate integrations
      // For now, simulate
      console.log(
        `[Payment] ${method} not yet integrated — simulating payment`
      );
      return {
        success: true,
        paymentUrl: `/checkout/success?simulated=true&orderId=${request.orderId}&method=${method}`,
        message: `Simulated ${method} payment`,
      };

    default:
      return {
        success: false,
        error: `Unknown payment method: ${method}`,
      };
  }
}

// ===================== HELPERS =====================

function sortObject(obj: Record<string, string>): Record<string, string> {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

function formatVNPayDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}${m}${d}${h}${min}${s}`;
}
