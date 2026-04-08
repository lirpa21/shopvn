/**
 * Order Confirmation Email Template
 * Generates a beautiful, responsive HTML email for order confirmations
 */

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    title: string;
    quantity: number;
    price: number;
    variant?: string;
    image?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    province: string;
  };
  estimatedDelivery: string;
  orderDate: string;
}

const paymentMethodLabels: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  momo: "Ví MoMo",
  vnpay: "VNPay",
  shopeepay: "ShopeePay",
  zalopay: "ZaloPay",
  bank_qr: "QR Ngân hàng",
};

function formatPriceEmail(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateOrderConfirmationEmail(data: OrderEmailData): string {
  const paymentLabel =
    paymentMethodLabels[data.paymentMethod] || data.paymentMethod;

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="60" valign="top">
                <div style="width: 56px; height: 56px; border-radius: 10px; background: #f5f5f7; overflow: hidden;">
                  ${
                    item.image
                      ? `<img src="${item.image}" width="56" height="56" style="object-fit: cover; display: block;" alt="${item.title}" />`
                      : `<div style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 20px;">📦</div>`
                  }
                </div>
              </td>
              <td style="padding-left: 14px;" valign="top">
                <p style="margin: 0; font-weight: 600; color: #1a1a2e; font-size: 14px; line-height: 1.4;">${item.title}</p>
                ${item.variant ? `<p style="margin: 4px 0 0; font-size: 12px; color: #888;">${item.variant}</p>` : ""}
                <p style="margin: 4px 0 0; font-size: 12px; color: #888;">SL: ${item.quantity}</p>
              </td>
              <td width="100" align="right" valign="top">
                <p style="margin: 0; font-weight: 700; color: #e85d5d; font-size: 14px;">${formatPriceEmail(item.price * item.quantity)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Xác nhận đơn hàng ${data.orderNumber} — ShopVN</title>
  <!--[if mso]>
  <style>table{border-collapse:collapse;}td{font-family:Arial,sans-serif;}</style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <!-- Preheader (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f5f5f7;">
    Cảm ơn bạn đã đặt hàng tại ShopVN! Mã đơn: ${data.orderNumber} — Tổng: ${formatPriceEmail(data.total)}
  </div>

  <!-- Container -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f7;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 0 0 24px;">
              <a href="https://shopvn.vn" style="text-decoration: none; font-size: 28px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px;">
                Shop<span style="color: #e85d5d;">VN</span>
              </a>
            </td>
          </tr>

          <!-- Success Card -->
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">

                <!-- Success Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #e85d5d 0%, #d14545 100%); padding: 32px 30px; text-align: center;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 16px; line-height: 56px; font-size: 28px;">
                      ✅
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                      Đặt hàng thành công!
                    </h1>
                    <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.5;">
                      Cảm ơn <strong>${data.customerName}</strong> đã mua sắm tại ShopVN
                    </p>
                  </td>
                </tr>

                <!-- Order Number -->
                <tr>
                  <td style="padding: 24px 30px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fef7f7; border-radius: 12px; border: 1px dashed #e85d5d40;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; font-weight: 600;">Mã đơn hàng</p>
                          <p style="margin: 6px 0 0; font-size: 20px; font-weight: 800; color: #e85d5d; letter-spacing: 1px;">${data.orderNumber}</p>
                        </td>
                        <td width="100" align="right" valign="middle" style="padding: 16px 20px;">
                          <p style="margin: 0; font-size: 11px; color: #999;">Ngày đặt</p>
                          <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #333;">${data.orderDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Items -->
                <tr>
                  <td style="padding: 24px 30px 0;">
                    <h2 style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #1a1a2e;">📦 Sản phẩm đặt mua</h2>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      ${itemRows}
                    </table>
                  </td>
                </tr>

                <!-- Price Summary -->
                <tr>
                  <td style="padding: 20px 30px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fafafa; border-radius: 12px;">
                      <tr><td style="padding: 16px 20px;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 4px 0; font-size: 13px; color: #666;">Tạm tính</td>
                            <td align="right" style="padding: 4px 0; font-size: 13px; color: #333; font-weight: 500;">${formatPriceEmail(data.subtotal)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-size: 13px; color: #666;">Phí vận chuyển</td>
                            <td align="right" style="padding: 4px 0; font-size: 13px; color: ${data.shippingFee === 0 ? "#16a34a" : "#333"}; font-weight: 500;">
                              ${data.shippingFee === 0 ? "Miễn phí" : formatPriceEmail(data.shippingFee)}
                            </td>
                          </tr>
                          ${
                            data.discount > 0
                              ? `<tr>
                                  <td style="padding: 4px 0; font-size: 13px; color: #666;">Giảm giá</td>
                                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #16a34a; font-weight: 600;">-${formatPriceEmail(data.discount)}</td>
                                </tr>`
                              : ""
                          }
                          <tr>
                            <td colspan="2" style="padding: 8px 0 0;"><hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;" /></td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0 0; font-size: 15px; font-weight: 700; color: #1a1a2e;">Tổng thanh toán</td>
                            <td align="right" style="padding: 10px 0 0; font-size: 18px; font-weight: 800; color: #e85d5d;">${formatPriceEmail(data.total)}</td>
                          </tr>
                        </table>
                      </td></tr>
                    </table>
                  </td>
                </tr>

                <!-- Shipping & Payment Info -->
                <tr>
                  <td style="padding: 0 30px 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="50%" valign="top" style="padding-right: 10px;">
                          <div style="background: #f5f5f7; border-radius: 12px; padding: 16px;">
                            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; font-weight: 600;">📍 Giao đến</p>
                            <p style="margin: 8px 0 0; font-size: 13px; font-weight: 600; color: #333;">${data.shippingAddress.name}</p>
                            <p style="margin: 2px 0 0; font-size: 12px; color: #666;">${data.shippingAddress.phone}</p>
                            <p style="margin: 4px 0 0; font-size: 12px; color: #666; line-height: 1.4;">${data.shippingAddress.address}, ${data.shippingAddress.province}</p>
                          </div>
                        </td>
                        <td width="50%" valign="top" style="padding-left: 10px;">
                          <div style="background: #f5f5f7; border-radius: 12px; padding: 16px;">
                            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; font-weight: 600;">💳 Thanh toán</p>
                            <p style="margin: 8px 0 0; font-size: 13px; font-weight: 600; color: #333;">${paymentLabel}</p>
                            <p style="margin: 8px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; font-weight: 600;">🚚 Giao hàng</p>
                            <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #16a34a;">${data.estimatedDelivery}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding: 0 30px 28px;" align="center">
                    <a href="https://shopvn.vn/account" style="display: inline-block; background: #e85d5d; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 12px; letter-spacing: 0.3px;">
                      Theo dõi đơn hàng →
                    </a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 20px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #999; line-height: 1.6;">
                Mọi thắc mắc vui lòng liên hệ hotline
                <a href="tel:19006868" style="color: #e85d5d; text-decoration: none; font-weight: 600;">1900 6868</a>
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #bbb;">
                Email này được gửi tự động từ ShopVN. Vui lòng không trả lời email này.
              </p>
              <p style="margin: 16px 0 0; font-size: 11px; color: #ccc;">
                © ${new Date().getFullYear()} ShopVN — Mua sắm trực tuyến hàng đầu Việt Nam
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
