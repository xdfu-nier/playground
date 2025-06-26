<script setup lang="ts">
import { ref } from 'vue'

const playgroundRef = ref()

const isOpen = ref(false)
defineExpose({
  playgroundRef
})
</script>

<template>
  <div class="h-screen dark:bg-dark-900 p-4 dark:text-light-100 pl-18">
    <Navigation v-model="isOpen">
      <slot name="nav" />
    </Navigation>
    <Playground ref="playgroundRef" />
  </div>
  <Settings v-model="isOpen" />
</template>
