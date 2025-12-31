"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { type Knowledge, type KnowledgeCategory, CATEGORY_LABELS } from "@/types";

interface KnowledgeEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  knowledge?: Knowledge;
  onSave: (data: Partial<Knowledge>) => Promise<void>;
}

const difficulties = [
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];

export function KnowledgeEditorDialog({
  open,
  onOpenChange,
  knowledge,
  onSave,
}: KnowledgeEditorDialogProps) {
  const [title, setTitle] = useState(knowledge?.title || "");
  const [content, setContent] = useState(knowledge?.content || "");
  const [category, setCategory] = useState<KnowledgeCategory>(
    knowledge?.category || "frontend"
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    knowledge?.difficulty || "medium"
  );
  const [tags, setTags] = useState<string[]>(knowledge?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = !!knowledge;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content,
        category,
        difficulty,
        tags,
      });
      onOpenChange(false);
      // Reset form
      if (!isEditing) {
        setTitle("");
        setContent("");
        setCategory("frontend");
        setDifficulty("medium");
        setTags([]);
      }
    } catch (error) {
      console.error("保存失败:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑知识点" : "添加知识点"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              placeholder="输入知识点标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>分类</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as KnowledgeCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>难度</Label>
              <Select
                value={difficulty}
                onValueChange={(value) =>
                  setDifficulty(value as "easy" | "medium" | "hard")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择难度" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex gap-2">
              <Input
                placeholder="输入标签后回车添加"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="rounded-lg"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                添加
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>内容</Label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              height={350}
              placeholder="在这里输入知识点内容，支持 Markdown 语法..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || saving}
          >
            {saving ? "保存中..." : isEditing ? "保存修改" : "发布"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
