"use client";

import { Search, TrendingUp, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const trendingTopics = [
  { id: 1, title: "React 19 新特性", count: 1256, category: "前端" },
  { id: 2, title: "算法面试技巧", count: 892, category: "面试" },
  { id: 3, title: "Spring Boot 3.5", count: 756, category: "后端" },
  { id: 4, title: "系统设计面试", count: 634, category: "系统设计" },
  { id: 5, title: "MySQL 优化实战", count: 523, category: "数据库" },
];

const suggestedUsers = [
  {
    id: 1,
    name: "张三",
    username: "zhangsan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
    bio: "阿里 P7，专注后端开发",
  },
  {
    id: 2,
    name: "李四",
    username: "lisi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
    bio: "字节跳动前端工程师",
  },
  {
    id: 3,
    name: "王五",
    username: "wangwu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
    bio: "腾讯架构师，分享系统设计",
  },
];

export function RightSidebar() {
  return (
    <div className="hidden lg:flex flex-col gap-4 p-4 w-80 xl:w-96">
      {/* Search */}
      <div className="sticky top-0 bg-background pt-1 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索知识点、题目、用户..."
            className="pl-10 bg-muted border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Trending Topics */}
      <Card className="bg-muted/50 border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            热门话题
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="group cursor-pointer hover:bg-accent/50 -mx-3 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {topic.category} · 热门
                  </p>
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {topic.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topic.count} 条讨论
                  </p>
                </div>
                {index < 3 && (
                  <Flame className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-primary hover:text-primary">
            查看更多
          </Button>
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card className="bg-muted/50 border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">推荐关注</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-start gap-3 group"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors cursor-pointer">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full h-8">
                    关注
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {user.bio}
                </p>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-primary hover:text-primary">
            查看更多
          </Button>
        </CardContent>
      </Card>

      {/* Study Stats */}
      <Card className="bg-muted/50 border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">今日学习</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-muted-foreground">分钟</p>
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">知识点</p>
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">题目</p>
            </div>
          </div>
          <Button className="w-full mt-4" variant="outline">
            开始今日打卡
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-xs text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">关于我们</a>
          <a href="#" className="hover:underline">帮助中心</a>
          <a href="#" className="hover:underline">隐私政策</a>
          <a href="#" className="hover:underline">服务条款</a>
        </div>
        <p>© 2024 面试宝典</p>
      </div>
    </div>
  );
}
