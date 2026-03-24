<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search-bar">
    <input
      type="search"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search..."
    />
    <button v-if="modelValue.length > 0" @click="$emit('update:modelValue', '')">Reset</button>
  </div>
</template>
