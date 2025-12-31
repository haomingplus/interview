"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  FileQuestion,
  Trophy,
  Flame,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { mockStudyRecords } from "@/hooks/use-mock-data";
import { cn } from "@/lib/utils";

export default function StudyPage() {
  const [isStudying, setIsStudying] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying) {
      interval = setInterval(() => {
        setStudyTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const today = new Date();

  // 生成本周日期
  const thisWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date;
  });

  const mockTasks = [
    { id: 1, title: "复习 React Hooks", type: "knowledge", completed: true },
    { id: 2, title: "刷 LeetCode 两道题", type: "question", completed: true },
    { id: 3, title: "学习 MySQL 索引优化", type: "knowledge", completed: false },
    { id: 4, title: "复习 TCP/IP 协议", type: "knowledge", completed: false },
    { id: 5, title: "完成系统设计练习", type: "interview", completed: false },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader title="学习中心">
        <Button className="rounded-full gap-2">
          <Plus className="h-4 w-4" />
          新建计划
        </Button>
      </PageHeader>

      <div className="p-4 space-y-6">
        {/* Study Timer Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">今日学习时长</p>
                <p className="text-4xl font-bold font-mono">{formatTime(studyTime)}</p>
              </div>
              <Button
                size="lg"
                className={cn(
                  "rounded-full h-16 w-16",
                  isStudying && "bg-destructive hover:bg-destructive/90"
                )}
                onClick={() => setIsStudying(!isStudying)}
              >
                {isStudying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>今日目标: 2 小时</span>
                <span>{Math.floor((studyTime / 7200) * 100)}%</span>
              </div>
              <Progress value={(studyTime / 7200) * 100} />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                本周打卡
              </CardTitle>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-bold">7 天连续</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {thisWeek.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                const isPast = date < today;
                const record = mockStudyRecords.find(
                  (r) => r.date === date.toISOString().split("T")[0]
                );
                const isCheckedIn = record?.isCheckedIn || false;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col items-center gap-2 p-2 rounded-lg",
                      isToday && "bg-primary/10"
                    )}
                  >
                    <span className="text-xs text-muted-foreground">
                      周{weekDays[index]}
                    </span>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        isCheckedIn
                          ? "bg-green-500 border-green-500 text-white"
                          : isPast
                          ? "border-muted-foreground/30 text-muted-foreground"
                          : "border-primary/30"
                      )}
                    >
                      {isCheckedIn ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm">{date.getDate()}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {!todayCheckedIn && (
              <Button
                className="w-full mt-4"
                onClick={() => setTodayCheckedIn(true)}
              >
                今日打卡
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">128</p>
                  <p className="text-xs text-muted-foreground">学习天数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <BookOpen className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">256</p>
                  <p className="text-xs text-muted-foreground">知识点</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/10">
                  <FileQuestion className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">189</p>
                  <p className="text-xs text-muted-foreground">刷题数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <Trophy className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">成就</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Plans */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="today" className="flex-1">
              今日任务
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex-1">
              学习计划
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              历史记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4 space-y-3">
            {mockTasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-accent/50",
                  task.completed && "opacity-60"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium",
                          task.completed && "line-through"
                        )}
                      >
                        {task.title}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {task.type === "knowledge"
                        ? "知识"
                        : task.type === "question"
                        ? "刷题"
                        : "面试"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              添加任务
            </Button>
          </TabsContent>

          <TabsContent value="plans" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>30天面试冲刺计划</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      2024.12.01 - 2024.12.31
                    </p>
                  </div>
                  <Badge>进行中</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>完成进度</span>
                    <span>18/30 天</span>
                  </div>
                  <Progress value={60} />
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-xl font-bold">45</p>
                      <p className="text-xs text-muted-foreground">知识点</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">120</p>
                      <p className="text-xs text-muted-foreground">刷题数</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">8</p>
                      <p className="text-xs text-muted-foreground">模拟面试</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              {mockStudyRecords.slice(0, 7).map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            record.isCheckedIn
                              ? "bg-green-500/10 text-green-500"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {record.isCheckedIn ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{record.date}</p>
                          <p className="text-sm text-muted-foreground">
                            学习 {record.studyTime} 分钟
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>知识点: {record.knowledgeCount}</span>
                        <span>题目: {record.questionCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
