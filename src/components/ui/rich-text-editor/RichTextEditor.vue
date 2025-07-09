<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  CheckSquare,
} from "lucide-vue-next";
import { watch } from "vue";

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editor = useEditor({
  content: props.modelValue || "",
  extensions: [
    StarterKit,
    ImageExtension,
    LinkExtension.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline",
      },
    }),
    Placeholder.configure({
      placeholder: "Write your notes here...",
      showOnlyWhenEditable: true,
      emptyEditorClass: "is-editor-empty",
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Underline,
    Highlight,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
  ],
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    const isSame = editor.value?.getHTML() === newValue;
    if (editor.value && !isSame) {
      editor.value.commands.setContent(newValue || "");
    }
  }
);

const addImage = () => {
  const url = window.prompt("Enter the URL of the image:");
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run();
  }
};

const addLink = () => {
  const url = window.prompt("Enter the URL:");
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run();
  }
};

const focusEditor = () => {
  if (editor.value) {
    editor.value.commands.focus();
  }
};
</script>

<template>
  <div class="flex flex-col h-[380px]">
    <div class="border p-1 flex flex-wrap gap-1 rounded-t-md bg-gray-50">
      <div class="flex items-center gap-1 border-r pr-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleBold().run()"
          :class="{ 'bg-muted': editor?.isActive('bold') }"
          title="Bold"
        >
          <span class="font-bold">B</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="{ 'bg-muted': editor?.isActive('italic') }"
          title="Italic"
        >
          <span class="italic">I</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="{ 'bg-muted': editor?.isActive('underline') }"
          title="Underline"
        >
          <span class="underline">U</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="{ 'bg-muted': editor?.isActive('strike') }"
          title="Strike"
        >
          <span class="line-through">S</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleHighlight().run()"
          :class="{ 'bg-muted': editor?.isActive('highlight') }"
          title="Highlight"
        >
          <Highlighter class="h-4 w-4" />
        </Button>
      </div>

      <div class="flex items-center gap-1 border-r pr-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-muted': editor?.isActive('heading', { level: 1 }) }"
          title="Heading 1"
        >
          <span class="font-bold">H1</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-muted': editor?.isActive('heading', { level: 2 }) }"
          title="Heading 2"
        >
          <span class="font-bold">H2</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleCode().run()"
          :class="{ 'bg-muted': editor?.isActive('code') }"
          title="Code"
        >
          <span class="font-mono">&lt;/&gt;</span>
        </Button>
      </div>

      <div class="flex items-center gap-1 border-r pr-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().setTextAlign('left').run()"
          :class="{ 'bg-muted': editor?.isActive({ textAlign: 'left' }) }"
          title="Align Left"
        >
          <AlignLeft class="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().setTextAlign('center').run()"
          :class="{ 'bg-muted': editor?.isActive({ textAlign: 'center' }) }"
          title="Align Center"
        >
          <AlignCenter class="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().setTextAlign('right').run()"
          :class="{ 'bg-muted': editor?.isActive({ textAlign: 'right' }) }"
          title="Align Right"
        >
          <AlignRight class="h-4 w-4" />
        </Button>
      </div>

      <div class="flex items-center gap-1 border-r pr-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-muted': editor?.isActive('bulletList') }"
          title="Bullet List"
        >
          <span>• List</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-muted': editor?.isActive('orderedList') }"
          title="Ordered List"
        >
          <span>1. List</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleTaskList().run()"
          :class="{ 'bg-muted': editor?.isActive('taskList') }"
          title="Task List"
        >
          <CheckSquare class="h-4 w-4" />
        </Button>
      </div>

      <div class="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="addImage"
          title="Add Image"
        >
          <ImageIcon class="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="addLink"
          :class="{ 'bg-muted': editor?.isActive('link') }"
          title="Add Link"
        >
          <LinkIcon class="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :class="{ 'bg-muted': editor?.isActive('blockquote') }"
          title="Blockquote"
        >
          <span>"</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().setHorizontalRule().run()"
          title="Horizontal Rule"
        >
          <span>―</span>
        </Button>
      </div>

      <div class="flex items-center gap-1 border-l pl-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().undo()"
          title="Undo"
        >
          <span>↩</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="editor?.chain().focus().redo().run()"
          :disabled="!editor?.can().redo()"
          title="Redo"
        >
          <span>↪</span>
        </Button>
      </div>
    </div>
    <div
      class="border border-t-0 rounded-b-md flex-1 overflow-hidden"
      @click="focusEditor"
    >
      <EditorContent
        :editor="editor"
        class="rich-text-content prose prose-sm max-w-none w-full h-full px-4 py-2 outline-none editor-content"
      />
    </div>
  </div>
</template>

<style>
.rich-text-content .ProseMirror {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 8px 0;
  outline: none;
  background: transparent;
  overflow-y: auto;
  overflow-x: hidden;
  border: none !important;
}

.rich-text-content .ProseMirror h1 {
  font-size: 1.75rem !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  margin-top: 0.75em !important;
  margin-bottom: 0.5em !important;
}

.rich-text-content .ProseMirror h2 {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
  margin-top: 0.75em !important;
  margin-bottom: 0.5em !important;
}

.rich-text-content .ProseMirror ul {
  list-style-type: disc !important;
  padding-left: 1.5em !important;
  margin: 0.5em 0 !important;
}

.rich-text-content .ProseMirror ol {
  list-style-type: decimal !important;
  padding-left: 1.5em !important;
  margin: 0.5em 0 !important;
}

.rich-text-content .ProseMirror ul li,
.rich-text-content .ProseMirror ol li {
  margin: 0.2em 0 !important;
}

.rich-text-content .ProseMirror ul[data-type="taskList"] {
  list-style-type: none !important;
  padding-left: 0.25em !important;
}

.rich-text-content .ProseMirror ul[data-type="taskList"] li {
  display: flex !important;
  align-items: flex-start !important;
  margin-bottom: 0.5em !important;
}

.rich-text-content .ProseMirror code {
  font-family: monospace !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
  border-radius: 3px !important;
  padding: 0.2em 0.4em !important;
}

.rich-text-content .ProseMirror blockquote {
  border-left: 3px solid #ccc !important;
  padding-left: 1em !important;
  margin-left: 0 !important;
  font-style: italic !important;
}

.editor-content {
  height: 100%;
  overflow-y: auto;
}

.rich-text-content .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.rich-text-content .ProseMirror > * + * {
  margin-top: 0.75em !important;
}

.rich-text-content .ProseMirror:focus {
  outline: none;
}

.rich-text-content .ProseMirror > *:last-child {
  margin-bottom: 8px !important;
}
</style>
