<script setup lang="ts">
import {Application} from "./three/Application"

import { onMounted, ref } from "vue";

const stage = ref(null);

async function initTHREE(){
  const  app = new Application({
    view: stage.value as any
  });
  //app.stage = new Stage();

}


onMounted( async ()=>{
  initTHREE()
});

</script>

<template>
  <div>
    <canvas ref="stage"/>
  </div>
</template>

<style scoped>
</style>
