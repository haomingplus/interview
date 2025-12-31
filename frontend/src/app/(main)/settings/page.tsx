"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Palette,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  LogOut,
  Shield,
  HelpCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    id: "account",
    title: "账号设置",
    icon: User,
    items: [
      { id: "profile", label: "个人资料", description: "修改头像、昵称、个人简介" },
      { id: "email", label: "邮箱设置", description: "绑定和修改邮箱地址" },
      { id: "phone", label: "手机号", description: "绑定和修改手机号码" },
    ],
  },
  {
    id: "security",
    title: "安全设置",
    icon: Lock,
    items: [
      { id: "password", label: "修改密码", description: "更新登录密码" },
      { id: "2fa", label: "两步验证", description: "增强账号安全性", hasSwitch: true },
      { id: "sessions", label: "登录设备", description: "管理已登录的设备" },
    ],
  },
  {
    id: "notifications",
    title: "通知设置",
    icon: Bell,
    items: [
      { id: "push", label: "推送通知", description: "接收系统推送通知", hasSwitch: true, defaultOn: true },
      { id: "email-notify", label: "邮件通知", description: "接收邮件通知", hasSwitch: true },
      { id: "study-remind", label: "学习提醒", description: "每日学习打卡提醒", hasSwitch: true, defaultOn: true },
    ],
  },
  {
    id: "payment",
    title: "支付与会员",
    icon: CreditCard,
    items: [
      { id: "membership", label: "会员管理", description: "查看和管理会员状态" },
      { id: "orders", label: "订单记录", description: "查看历史订单" },
      { id: "payment-methods", label: "支付方式", description: "管理支付方式" },
    ],
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    "2fa": false,
    push: true,
    "email-notify": false,
    "study-remind": true,
  });

  const handleSwitchChange = (id: string) => {
    setSwitches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="设置" showBack />

      <div className="p-4 space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">外观设置</CardTitle>
                <CardDescription>选择你喜欢的主题模式</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {[
                { value: "light", label: "浅色", icon: Sun },
                { value: "dark", label: "深色", icon: Moon },
                { value: "system", label: "系统", icon: Monitor },
              ].map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                    theme === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  )}
                  onClick={() => setTheme(option.value)}
                >
                  <option.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <section.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, index) => (
                <div key={item.id}>
                  <div
                    className={cn(
                      "flex items-center justify-between py-3 px-2 -mx-2 rounded-lg transition-colors",
                      !item.hasSwitch && "cursor-pointer hover:bg-accent"
                    )}
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {item.hasSwitch ? (
                      <Switch
                        checked={switches[item.id]}
                        onCheckedChange={() => handleSwitchChange(item.id)}
                      />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  {index < section.items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Other Options */}
        <Card>
          <CardContent className="pt-6 space-y-1">
            <div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg cursor-pointer hover:bg-accent">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">隐私政策</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg cursor-pointer hover:bg-accent">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">帮助中心</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg cursor-pointer hover:bg-accent">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">关于我们</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">v1.0.0</span>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button variant="outline" className="w-full text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
