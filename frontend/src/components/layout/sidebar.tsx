"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  GraduationCap,
  FileQuestion,
  Users,
  MessageCircle,
  Bell,
  Bookmark,
  User,
  Settings,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockUser } from "@/hooks/use-mock-data";

const navigation = [
  { name: "首页", href: "/", icon: Home },
  { name: "知识库", href: "/knowledge", icon: BookOpen },
  { name: "学习", href: "/study", icon: GraduationCap },
  { name: "题库", href: "/questions", icon: FileQuestion },
  { name: "模拟面试", href: "/interview", icon: Sparkles },
  { name: "社区", href: "/community", icon: Users },
  { name: "消息", href: "/messages", icon: MessageCircle, badge: 3 },
  { name: "通知", href: "/notifications", icon: Bell, badge: 5 },
  { name: "收藏", href: "/bookmarks", icon: Bookmark },
  { name: "个人主页", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen flex-col justify-between border-r border-border px-2 py-4 xl:w-64 xl:px-4">
        {/* Logo */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center justify-center xl:justify-start p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-xl font-bold text-primary-foreground">面</span>
            </div>
            <span className="ml-3 hidden text-xl font-bold xl:block">
              面试宝典
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 mt-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center xl:justify-start gap-4 rounded-full px-3 py-3 text-lg transition-colors hover:bg-accent",
                        isActive && "font-bold"
                      )}
                    >
                      <div className="relative">
                        <item.icon className="h-6 w-6" />
                        {item.badge && (
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="hidden xl:block">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="xl:hidden">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex items-center justify-center xl:justify-start gap-4 rounded-full px-3 py-3 text-lg transition-colors hover:bg-accent"
                >
                  <Settings className="h-6 w-6" />
                  <span className="hidden xl:block">设置</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="xl:hidden">
                设置
              </TooltipContent>
            </Tooltip>
          </nav>

          {/* Create Button */}
          <Button className="mt-4 h-12 w-full xl:w-auto" size="lg">
            <span className="hidden xl:block">发布动态</span>
            <span className="xl:hidden">+</span>
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-center xl:justify-start gap-3 rounded-full p-3 transition-colors hover:bg-accent">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockUser.avatar} alt={mockUser.nickname} />
                <AvatarFallback>{mockUser.nickname?.[0]}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-1 text-left xl:block">
                <p className="text-sm font-semibold">{mockUser.nickname}</p>
                <p className="text-sm text-muted-foreground">@{mockUser.username}</p>
              </div>
              <MoreHorizontal className="hidden h-5 w-5 xl:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              查看个人主页
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              账号设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}
