import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "面试宝典 - 面试知识库与学习管理系统",
  description: "专业的面试知识库管理、学习计划制定、题库练习和社区交流平台",
  keywords: ["面试", "知识库", "学习", "题库", "算法", "前端", "后端"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
