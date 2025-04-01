<script setup lang="ts">
console.log('App.vue mounted')
</script>

<template>
  <router-view :key="$route.path + JSON.stringify($route.params)" />
</template>
