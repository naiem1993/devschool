import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "আমি Next.js" — এই তথ্য বাইরে দেখাবে না
  poweredByHeader: false,

  // ফাইল ছোট করে পাঠাও → দ্রুত লোড
  compress: true,

  // ছবি আধুনিক ফরম্যাটে (AVIF/WebP) দাও → হালকা + দ্রুত
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // নিরাপত্তার তালা — সব পেজে
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
