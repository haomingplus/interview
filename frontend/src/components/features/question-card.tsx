"use client";

import { Check, Heart, Bookmark, Building2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import type { Question } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface QuestionCardProps {
  question: Question;
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

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  return (
    <article
      className="border-b border-border p-4 hover:bg-accent/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Solved Status */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
            question.isSolved
              ? "border-green-500 bg-green-500/10 text-green-500"
              : "border-muted-foreground/30 text-muted-foreground"
          )}
        >
          {question.isSolved ? (
            <Check className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium">?</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {question.company && (
                <>
                  <Building2 className="h-4 w-4" />
                  <span>{question.company}</span>
                  <span>·</span>
                </>
              )}
              <span>{formatDate(question.createdAt)}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>标记为已解决</DropdownMenuItem>
                <DropdownMenuItem>添加到收藏夹</DropdownMenuItem>
                <DropdownMenuItem>分享</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mt-1 hover:text-primary transition-colors">
            {question.title}
          </h3>

          {/* Content Preview */}
          <p className="text-muted-foreground mt-2 line-clamp-2">
            {question.content.slice(0, 150)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline">
              {CATEGORY_LABELS[question.category]}
            </Badge>
            <Badge variant={difficultyColors[question.difficulty]}>
              {difficultyLabels[question.difficulty]}
            </Badge>
            {question.source && (
              <Badge variant="secondary">{question.source}</Badge>
            )}
            {question.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-muted-foreground hover:text-pink-500 rounded-full",
                question.isLiked && "text-pink-500"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className={cn("h-4 w-4", question.isLiked && "fill-current")} />
              <span>{formatNumber(question.likeCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-muted-foreground hover:text-blue-500 rounded-full",
                question.isCollected && "text-blue-500"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className={cn("h-4 w-4", question.isCollected && "fill-current")} />
              <span>{formatNumber(question.collectCount)}</span>
            </Button>

            <span className="text-sm text-muted-foreground">
              {formatNumber(question.viewCount)} 次浏览
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
