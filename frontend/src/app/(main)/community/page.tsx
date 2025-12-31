"use client";

import { useState } from "react";
import { ImageIcon, BarChart2, Smile, MapPin, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { PostCard } from "@/components/features/post-card";
import { mockUser, useMockPosts } from "@/hooks/use-mock-data";

export default function CommunityPage() {
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("experience");
  const { data: posts, loading } = useMockPosts();

  return (
    <div className="min-h-screen">
      <PageHeader title="社区" />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-0">
          <TabsTrigger value="all" className="flex-1 data-[state=active]:border-b-2">
            全部
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex-1 data-[state=active]:border-b-2">
            面经
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex-1 data-[state=active]:border-b-2">
            知识分享
          </TabsTrigger>
          <TabsTrigger value="question" className="flex-1 data-[state=active]:border-b-2">
            问答
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {/* Compose Box */}
          <div className="border-b border-border p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback>{mockUser.nickname?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex gap-2 mb-3">
                  {[
                    { value: "experience", label: "面经分享" },
                    { value: "knowledge", label: "知识分享" },
                    { value: "question", label: "提问" },
                    { value: "discussion", label: "讨论" },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={postType === type.value ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setPostType(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder={
                    postType === "experience"
                      ? "分享你的面试经验..."
                      : postType === "knowledge"
                      ? "分享你学到的知识..."
                      : postType === "question"
                      ? "有什么问题想问大家..."
                      : "想讨论点什么..."
                  }
                  className="min-h-[100px] resize-none border-0 bg-transparent p-0 text-lg focus-visible:ring-0"
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="experience" className="mt-0">
          <div>
            {posts
              .filter((p) => p.type === "experience")
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="mt-0">
          <div>
            {posts
              .filter((p) => p.type === "knowledge")
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="question" className="mt-0">
          <div>
            {posts
              .filter((p) => p.type === "question")
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
