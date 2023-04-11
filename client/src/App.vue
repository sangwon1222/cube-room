<script setup lang="ts">
import PIXIApp from "./PIXIApp.vue"
import ThreeApp from "./ThreeApp.vue"

</script>

<template>
  <div>
    <component :is="PIXIApp" />
    <component :is="ThreeApp" />
  </div>
</template>

<style scoped>
</style>
