"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
  preview?: "edit" | "live" | "preview";
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "在这里输入内容，支持 Markdown 语法...",
  height = 400,
  className,
  preview = "live",
}: MarkdownEditorProps) {
  return (
    <div className={cn("markdown-editor", className)} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={height}
        preview={preview}
        textareaProps={{
          placeholder,
        }}
        previewOptions={{
          style: {
            backgroundColor: "transparent",
          },
        }}
      />
    </div>
  );
}

// Markdown 预览组件
const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div className={cn("markdown-viewer", className)} data-color-mode="light">
      <MarkdownPreview source={content} />
    </div>
  );
}
