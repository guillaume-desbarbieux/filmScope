<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/">Home</RouterLink>
    <span> | </span>
    <RouterLink to="/favorites">Favorites</RouterLink>
  </nav>
</template>

<style scoped>
.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid currentColor;
}
</style>
