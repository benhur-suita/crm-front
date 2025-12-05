<template>
  <div class="editor-container">
    <div class="menu-bar">
      <button
        @click="toggleBold"
        :class="{ 'is-active': editor?.isActive('bold') }"
        type="button"
        class="toolbar-btn"
      >
        <strong>B</strong>
      </button>
      <button
        @click="toggleItalic"
        :class="{ 'is-active': editor?.isActive('italic') }"
        type="button"
        class="toolbar-btn"
      >
        <em>I</em>
      </button>
    </div>
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'proseMirror',
      placeholder: 'Digite sua descrição...',
    },
  },
})

const toggleBold = () => {
  editor.value.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  editor.value.chain().focus().toggleItalic().run()
}

watch(() => props.modelValue, (value) => {
  if (editor.value && value !== editor.value.getHTML()) {
    editor.value.commands.setContent(value, false)
  }
})
</script>

<style scoped>
.editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.menu-bar {
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.toolbar-btn:hover {
  background: #f0f0f0;
}

.toolbar-btn.is-active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.editor-content {
  padding: 12px;
  min-height: 120px;
}

/* Estilos do conteúdo editável */
:deep(.ProseMirror) {
  outline: none;
  min-height: 100px;
  line-height: 1.5;
  font-family: inherit;
}

:deep(.ProseMirror p) {
  margin: 0 0 8px 0;
}

:deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

:deep(.ProseMirror:focus) {
  outline: none;
}
</style>