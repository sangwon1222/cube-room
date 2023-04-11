<script setup lang="ts">
import * as PIXI from "pixi.js"
import { Stage } from "./pixi/Stage"

import { onMounted, ref } from "vue";

const stage = ref(null);

async function initPIXI(){
  const  app = new PIXI.Application({
    view: stage.value as any
  });
  app.stage = new Stage();

}


onMounted( async ()=>{
  initPIXI()
});

</script>

<template>
  <div>
    <canvas ref="stage"/>
  </div>
</template>

<style scoped>
</style>
