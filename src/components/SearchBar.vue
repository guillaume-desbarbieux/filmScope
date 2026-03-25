<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const query = ref('')

let debounceTimer = null

function onInput(value) {
  query.value = value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('search', value.trim()), 400)
}

function reset() {
  query.value = ''
  clearTimeout(debounceTimer)
  emit('search', '')
}
</script>


<template>
  <div class="search-bar" :class="{ active: query.length > 0 }">
    <span class="search-icon">⌕</span>
    <input
      type="search"
      :value="query"
      placeholder="Rechercher un film..."
      @input="onInput($event.target.value)"
    />
    <button v-if="query.length > 0" class="reset-btn" @click="reset">
      Effacer
    </button>
  </div>
</template>


<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background: var(--c-surface);
  border: 0.5px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  max-width: 480px;
  transition: border-color 0.2s;
}
.search-bar:focus-within {
  border-color: rgba(232, 160, 48, 0.5);
}
.search-icon {
  padding: 0 12px 0 14px;
  color: var(--c-muted);
  font-size: 14px;
  user-select: none;
  flex-shrink: 0;
}
input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--c-text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  padding: 10px 0;
  caret-color: var(--c-amber);
}
input::placeholder {
  color: var(--c-muted);
}

.reset-btn {
  background: none;
  border: none;
  border-left: 0.5px solid var(--c-border);
  color: var(--c-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 14px;
  min-height: 40px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.2s,
    background 0.2s;
}
.reset-btn:hover {
  color: var(--c-text);
  background: rgba(255, 255, 255, 0.04);
}
</style>
