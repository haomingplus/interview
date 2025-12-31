"use client";

import { useState } from "react";
import { Search, Filter, Plus, Grid, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { KnowledgeCard } from "@/components/features/knowledge-card";
import { KnowledgeEditorDialog } from "@/components/features/knowledge-editor-dialog";
import { useMockKnowledge } from "@/hooks/use-mock-data";
import { type Knowledge, type KnowledgeCategory } from "@/types";

const categories: { value: KnowledgeCategory | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "algorithm", label: "算法" },
  { value: "data-structure", label: "数据结构" },
  { value: "frontend", label: "前端" },
  { value: "backend", label: "后端" },
  { value: "database", label: "数据库" },
  { value: "network", label: "网络" },
  { value: "system-design", label: "系统设计" },
  { value: "os", label: "操作系统" },
];

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editorOpen, setEditorOpen] = useState(false);
  const { data: knowledge, loading } = useMockKnowledge();

  const handleSaveKnowledge = async (data: Partial<Knowledge>) => {
    // TODO: Call API to save knowledge
    console.log("Saving knowledge:", data);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const filteredKnowledge = knowledge.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <PageHeader title="知识库">
        <Button className="rounded-full gap-2" onClick={() => setEditorOpen(true)}>
          <Plus className="h-4 w-4" />
          添加知识点
        </Button>
      </PageHeader>

      <KnowledgeEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveKnowledge}
      />

      {/* Search and Filters */}
      <div className="border-b border-border p-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索知识点..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="flex border rounded-full overflow-hidden">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="collected">我的收藏</TabsTrigger>
          <TabsTrigger value="recent">最近浏览</TabsTrigger>
          <TabsTrigger value="mine">我创建的</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredKnowledge.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">没有找到相关知识点</h3>
              <p className="text-muted-foreground text-center">
                尝试更换搜索关键词或筛选条件
              </p>
            </div>
          ) : (
            <div>
              {filteredKnowledge.map((item) => (
                <KnowledgeCard key={item.id} knowledge={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collected" className="mt-0">
          <div>
            {knowledge
              .filter((item) => item.isCollected)
              .map((item) => (
                <KnowledgeCard key={item.id} knowledge={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h3 className="text-xl font-bold mb-2">暂无浏览记录</h3>
            <p className="text-muted-foreground">开始浏览知识点后，这里会显示你的浏览历史</p>
          </div>
        </TabsContent>

        <TabsContent value="mine" className="mt-0">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h3 className="text-xl font-bold mb-2">还没有创建知识点</h3>
            <p className="text-muted-foreground mb-4">创建你自己的知识点，记录学习心得</p>
            <Button onClick={() => setEditorOpen(true)}>创建第一个知识点</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
