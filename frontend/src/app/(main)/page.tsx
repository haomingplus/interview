"use client";

import { useState } from "react";
import { Sparkles, ImageIcon, BarChart2, Smile, MapPin, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { PostCard } from "@/components/features/post-card";
import { KnowledgeCard } from "@/components/features/knowledge-card";
import { mockUser, useMockPosts, useMockKnowledge } from "@/hooks/use-mock-data";

export default function HomePage() {
  const [postContent, setPostContent] = useState("");
  const { data: posts, loading: postsLoading } = useMockPosts();
  const { data: knowledge, loading: knowledgeLoading } = useMockKnowledge();

  return (
    <div className="min-h-screen">
      <PageHeader title="首页" />

      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-0">
          <TabsTrigger value="for-you" className="flex-1 data-[state=active]:border-b-2">
            推荐
          </TabsTrigger>
          <TabsTrigger value="following" className="flex-1 data-[state=active]:border-b-2">
            关注
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex-1 data-[state=active]:border-b-2">
            知识
          </TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="mt-0">
          {/* Compose Box */}
          <div className="border-b border-border p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback>{mockUser.nickname?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="分享你的学习心得、面试经验..."
                  className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-lg focus-visible:ring-0"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full text-primary">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-primary">
                      <BarChart2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-primary">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-primary">
                      <Calendar className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-primary">
                      <MapPin className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    className="rounded-full px-6"
                    disabled={!postContent.trim()}
                  >
                    发布
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div>
            {postsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="following" className="mt-0">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">还没有关注任何人</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              关注其他用户，获取他们的最新动态、面试经验和学习心得
            </p>
            <Button className="mt-4">发现更多用户</Button>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="mt-0">
          {/* Knowledge Feed */}
          <div>
            {knowledgeLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              knowledge.map((item) => (
                <KnowledgeCard key={item.id} knowledge={item} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
