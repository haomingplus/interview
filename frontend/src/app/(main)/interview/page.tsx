"use client";

import { useState } from "react";
import {
  Sparkles,
  Play,
  Clock,
  Mic,
  Video,
  FileText,
  History,
  Star,
  ChevronRight,
  Brain,
  Code,
  Database,
  Layout,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

const interviewTypes = [
  {
    id: "frontend",
    title: "前端面试",
    icon: Layout,
    description: "React、Vue、JavaScript、CSS 等",
    color: "text-blue-500 bg-blue-500/10",
    questions: 120,
  },
  {
    id: "backend",
    title: "后端面试",
    icon: Server,
    description: "Java、Spring、微服务、API 设计",
    color: "text-green-500 bg-green-500/10",
    questions: 150,
  },
  {
    id: "algorithm",
    title: "算法面试",
    icon: Brain,
    description: "数据结构、算法、编程题",
    color: "text-purple-500 bg-purple-500/10",
    questions: 200,
  },
  {
    id: "database",
    title: "数据库面试",
    icon: Database,
    description: "MySQL、Redis、MongoDB",
    color: "text-orange-500 bg-orange-500/10",
    questions: 80,
  },
  {
    id: "system",
    title: "系统设计",
    icon: Code,
    description: "架构设计、高可用、高并发",
    color: "text-pink-500 bg-pink-500/10",
    questions: 60,
  },
];

const recentInterviews = [
  {
    id: 1,
    type: "前端面试",
    date: "2024-12-28",
    duration: 45,
    score: 85,
    questions: 10,
  },
  {
    id: 2,
    type: "算法面试",
    date: "2024-12-27",
    duration: 60,
    score: 72,
    questions: 8,
  },
  {
    id: 3,
    type: "系统设计",
    date: "2024-12-25",
    duration: 55,
    score: 90,
    questions: 5,
  },
];

export default function InterviewPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <PageHeader title="模拟面试">
        <Button className="rounded-full gap-2">
          <Sparkles className="h-4 w-4" />
          AI 智能出题
        </Button>
      </PageHeader>

      <div className="p-4 space-y-6">
        {/* Quick Start */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">开始模拟面试</h3>
                <p className="text-muted-foreground">
                  AI 驱动的模拟面试，实时反馈，助你轻松通过面试
                </p>
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    30-60 分钟
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mic className="h-4 w-4" />
                    语音支持
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    详细报告
                  </div>
                </div>
              </div>
              <Button size="lg" className="rounded-full h-16 w-16">
                <Play className="h-6 w-6 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interview Types */}
        <div>
          <h3 className="font-semibold mb-4">选择面试类型</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewTypes.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedType === type.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", type.color)}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{type.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {type.questions} 道题目
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interview Settings */}
        {selectedType && (
          <Card>
            <CardHeader>
              <CardTitle>面试设置</CardTitle>
              <CardDescription>根据你的需求配置面试参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">面试时长</label>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="cursor-pointer">
                      30 分钟
                    </Badge>
                    <Badge variant="default" className="cursor-pointer">
                      45 分钟
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      60 分钟
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">难度等级</label>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="cursor-pointer">
                      初级
                    </Badge>
                    <Badge variant="default" className="cursor-pointer">
                      中级
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      高级
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  开始面试
                </Button>
                <Button variant="outline" size="lg">
                  <Video className="h-4 w-4 mr-2" />
                  视频模式
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs: History & Stats */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              面试记录
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Star className="h-4 w-4" />
              能力分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4 space-y-4">
            {recentInterviews.map((interview) => (
              <Card key={interview.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          interview.score >= 80
                            ? "bg-green-500/10 text-green-500"
                            : interview.score >= 60
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                        )}
                      >
                        <span className="font-bold">{interview.score}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{interview.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {interview.date} · {interview.duration} 分钟 · {interview.questions} 道题
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>能力雷达图</CardTitle>
                <CardDescription>基于你的面试表现分析各项能力</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "基础知识", score: 85 },
                    { name: "算法能力", score: 72 },
                    { name: "系统设计", score: 78 },
                    { name: "代码能力", score: 90 },
                    { name: "沟通表达", score: 82 },
                  ].map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.score}%</span>
                      </div>
                      <Progress value={item.score} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
