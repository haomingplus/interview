"use client";

import { Heart, MessageCircle, Bookmark, Share, MoreHorizontal } from "lucide-react";
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
import type { Knowledge } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface KnowledgeCardProps {
  knowledge: Knowledge;
  onClick?: () => void;
}

const difficultyColors = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
} as const;

const difficultyLabels = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
} as const;

export function KnowledgeCard({ knowledge, onClick }: KnowledgeCardProps) {
  return (
    <article
      className="border-b border-border p-4 hover:bg-accent/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={knowledge.author?.avatar} />
          <AvatarFallback>{knowledge.author?.nickname?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold hover:underline">
                {knowledge.author?.nickname || "未知作者"}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {formatDate(knowledge.createdAt)}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>添加到收藏夹</DropdownMenuItem>
                <DropdownMenuItem>分享</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">举报</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mt-1 hover:text-primary transition-colors">
            {knowledge.title}
          </h3>

          {/* Content Preview */}
          <p className="text-muted-foreground mt-2 line-clamp-3">
            {knowledge.content.replace(/[#*`]/g, "").slice(0, 200)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline">
              {CATEGORY_LABELS[knowledge.category]}
            </Badge>
            <Badge variant={difficultyColors[knowledge.difficulty]}>
              {difficultyLabels[knowledge.difficulty]}
            </Badge>
            {knowledge.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-muted-foreground hover:text-primary rounded-full",
                knowledge.isLiked && "text-pink-500 hover:text-pink-500"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className={cn("h-4 w-4", knowledge.isLiked && "fill-current")} />
              <span>{formatNumber(knowledge.likeCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{formatNumber(knowledge.viewCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-muted-foreground hover:text-blue-500 rounded-full",
                knowledge.isCollected && "text-blue-500"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className={cn("h-4 w-4", knowledge.isCollected && "fill-current")} />
              <span>{formatNumber(knowledge.collectCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-green-500 rounded-full"
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
