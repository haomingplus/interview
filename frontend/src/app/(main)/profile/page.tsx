"use client";

import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Settings,
  BookOpen,
  FileQuestion,
  Trophy,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { PostCard } from "@/components/features/post-card";
import { KnowledgeCard } from "@/components/features/knowledge-card";
import { mockUser, useMockPosts, useMockKnowledge } from "@/hooks/use-mock-data";

export default function ProfilePage() {
  const { data: posts } = useMockPosts();
  const { data: knowledge } = useMockKnowledge();

  return (
    <div className="min-h-screen">
      <PageHeader title={mockUser.nickname || "个人主页"} showBack>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
        </Button>
      </PageHeader>

      {/* Profile Header */}
      <div className="border-b border-border">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />

        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="-mt-16 mb-4 flex items-end justify-between">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={mockUser.avatar} alt={mockUser.nickname} />
              <AvatarFallback className="text-4xl">{mockUser.nickname?.[0]}</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="rounded-full">
              编辑资料
            </Button>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold">{mockUser.nickname}</h2>
              <p className="text-muted-foreground">@{mockUser.username}</p>
            </div>

            {mockUser.bio && <p>{mockUser.bio}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>中国 · 北京</span>
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a href="#" className="text-primary hover:underline">
                  github.com/developer
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>2024年1月加入</span>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <span>
                <strong>256</strong>{" "}
                <span className="text-muted-foreground">关注</span>
              </span>
              <span>
                <strong>1,024</strong>{" "}
                <span className="text-muted-foreground">粉丝</span>
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">VIP 会员</Badge>
              <Badge variant="secondary">面试达人</Badge>
              <Badge variant="secondary">知识贡献者</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 divide-x border-b border-border">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{mockUser.studyDays}</p>
          <p className="text-xs text-muted-foreground">学习天数</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
            <BookOpen className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">256</p>
          <p className="text-xs text-muted-foreground">知识点</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-purple-500 mb-1">
            <FileQuestion className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{mockUser.questionsSolved}</p>
          <p className="text-xs text-muted-foreground">刷题数</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
            <Trophy className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">成就</p>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-0">
          <TabsTrigger value="posts" className="flex-1">
            动态
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex-1">
            知识
          </TabsTrigger>
          <TabsTrigger value="likes" className="flex-1">
            喜欢
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex-1">
            收藏
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <h3 className="text-xl font-bold mb-2">还没有发布动态</h3>
              <p className="text-muted-foreground">分享你的学习心得和面试经验</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="knowledge" className="mt-0">
          {knowledge.length > 0 ? (
            knowledge.map((item) => (
              <KnowledgeCard key={item.id} knowledge={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <h3 className="text-xl font-bold mb-2">还没有创建知识点</h3>
              <p className="text-muted-foreground">开始创建你的知识库</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          {posts
            .filter((p) => p.isLiked)
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>

        <TabsContent value="collections" className="mt-0">
          {knowledge
            .filter((k) => k.isCollected)
            .map((item) => (
              <KnowledgeCard key={item.id} knowledge={item} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
