"use client";

import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

const typeLabels: Record<string, string> = {
  experience: "面经分享",
  knowledge: "知识分享",
  question: "问答",
  discussion: "讨论",
};

const typeColors: Record<string, "default" | "secondary" | "info" | "success"> = {
  experience: "success",
  knowledge: "info",
  question: "secondary",
  discussion: "default",
};

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      className="border-b border-border p-4 hover:bg-accent/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.nickname?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="font-semibold hover:underline">
                {post.author.nickname}
              </span>
              <span className="text-muted-foreground">@{post.author.username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {formatDate(post.createdAt)}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>关注 @{post.author.username}</DropdownMenuItem>
                <DropdownMenuItem>添加到收藏夹</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">举报</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Type Badge */}
          <div className="mt-1">
            <Badge variant={typeColors[post.type]}>
              {typeLabels[post.type]}
            </Badge>
          </div>

          {/* Content */}
          <p className="mt-2 whitespace-pre-wrap">{post.content}</p>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 max-w-lg">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-blue-500 rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{formatNumber(post.commentCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-green-500 rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Repeat2 className="h-4 w-4" />
              <span>{formatNumber(post.shareCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-muted-foreground hover:text-pink-500 rounded-full",
                post.isLiked && "text-pink-500"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
              <span>{formatNumber(post.likeCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-muted-foreground hover:text-blue-500 rounded-full",
                post.isCollected && "text-blue-500"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className={cn("h-4 w-4", post.isCollected && "fill-current")} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
