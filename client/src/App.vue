<template>
  <div id="app">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Application } from "@three/app/Application";

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  const app = new Application({ view: canvas.value! });
});
</script>
