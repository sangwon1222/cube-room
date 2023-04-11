<script setup lang="ts">
import { Application } from "@three/app/Application";
import { onMounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  const app = new Application({ view: canvas.value! });
});
</script>

<template>
  <div id="wrap">
    <canvas ref="canvas" />
  </div>
</template>
