import { ref, nextTick } from 'vue'

export function useAutoResizeTextarea() {
  const textareaRef = ref<HTMLTextAreaElement | null>(null)

  function autoResize() {
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
      }
    })
  }

  return {
    textareaRef,
    autoResize,
  }
}
