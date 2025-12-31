"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRequirements = [
    { label: "至少 8 个字符", met: formData.password.length >= 8 },
    { label: "包含大写字母", met: /[A-Z]/.test(formData.password) },
    { label: "包含小写字母", met: /[a-z]/.test(formData.password) },
    { label: "包含数字", met: /\d/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-3xl font-bold text-primary-foreground">面</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold">面试宝典</h1>
          <p className="text-muted-foreground">创建你的账号</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>注册账号</CardTitle>
            <CardDescription>
              开始你的面试备战之旅
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="邮箱地址"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="relative space-y-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="密码"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="space-y-2">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        req.met ? "text-green-500" : "text-muted-foreground"
                      )}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          req.met ? "opacity-100" : "opacity-30"
                        )}
                      />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="确认密码"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-destructive">两次输入的密码不一致</p>
                  )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading ||
                  !passwordRequirements.every((r) => r.met) ||
                  formData.password !== formData.confirmPassword
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                注册
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">已有账号? </span>
              <Link href="/login" className="text-primary hover:underline">
                立即登录
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              注册即表示你同意我们的{" "}
              <Link href="#" className="text-primary hover:underline">
                服务条款
              </Link>{" "}
              和{" "}
              <Link href="#" className="text-primary hover:underline">
                隐私政策
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
