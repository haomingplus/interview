"use client";

import { useState } from "react";
import { Search, Filter, Plus, Shuffle, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import { QuestionCard } from "@/components/features/question-card";
import { useMockQuestions } from "@/hooks/use-mock-data";
import { type KnowledgeCategory } from "@/types";

const categories: { value: KnowledgeCategory | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "algorithm", label: "算法" },
  { value: "frontend", label: "前端" },
  { value: "backend", label: "后端" },
  { value: "database", label: "数据库" },
  { value: "system-design", label: "系统设计" },
];

const companies = ["字节跳动", "阿里巴巴", "腾讯", "美团", "京东", "百度"];

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const { data: questions, loading } = useMockQuestions();

  const filteredQuestions = questions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const totalQuestions = 500;
  const solvedQuestions = 189;
  const easyTotal = 150;
  const easySolved = 89;
  const mediumTotal = 250;
  const mediumSolved = 78;
  // Reserved for hard difficulty stats display
  void 0; // _hardTotal = 100, _hardSolved = 22

  return (
    <div className="min-h-screen">
      <PageHeader title="题库">
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full gap-2">
            <Shuffle className="h-4 w-4" />
            随机刷题
          </Button>
          <Button className="rounded-full gap-2">
            <Plus className="h-4 w-4" />
            添加题目
          </Button>
        </div>
      </PageHeader>

      <div className="p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">刷题进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div>
                  <span className="text-4xl font-bold">{solvedQuestions}</span>
                  <span className="text-muted-foreground">/{totalQuestions}</span>
                </div>
                <Progress value={(solvedQuestions / totalQuestions) * 100} className="flex-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-500">简单</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{easySolved}/{easyTotal}</span>
                <Progress value={(easySolved / easyTotal) * 100} className="w-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-500">中等</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{mediumSolved}/{mediumTotal}</span>
                <Progress value={(mediumSolved / mediumTotal) * 100} className="w-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索题目..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
            <div className="w-px bg-border mx-2" />
            <Badge
              variant={selectedDifficulty === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedDifficulty("all")}
            >
              全部难度
            </Badge>
            <Badge
              variant={selectedDifficulty === "easy" ? "success" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedDifficulty("easy")}
            >
              简单
            </Badge>
            <Badge
              variant={selectedDifficulty === "medium" ? "warning" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedDifficulty("medium")}
            >
              中等
            </Badge>
            <Badge
              variant={selectedDifficulty === "hard" ? "destructive" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedDifficulty("hard")}
            >
              困难
            </Badge>
          </div>

          {/* Company Filters */}
          <div className="flex flex-wrap gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            {companies.map((company) => (
              <Badge key={company} variant="secondary" className="cursor-pointer">
                {company}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">全部题目</TabsTrigger>
            <TabsTrigger value="unsolved">未做</TabsTrigger>
            <TabsTrigger value="solved">已做</TabsTrigger>
            <TabsTrigger value="wrong">错题本</TabsTrigger>
            <TabsTrigger value="collected">收藏</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div>
                {filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unsolved" className="mt-0">
            <div>
              {questions
                .filter((q) => !q.isSolved)
                .map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="solved" className="mt-0">
            <div>
              {questions
                .filter((q) => q.isSolved)
                .map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="wrong" className="mt-0">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <h3 className="text-xl font-bold mb-2">错题本为空</h3>
              <p className="text-muted-foreground">做题过程中标记的错题会显示在这里</p>
            </div>
          </TabsContent>

          <TabsContent value="collected" className="mt-0">
            <div>
              {questions
                .filter((q) => q.isCollected)
                .map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
