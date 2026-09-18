<script setup>
import { ref } from 'vue'
import { useChakraCanvas } from '../composables/useChakraCanvas'

const canvasRef = ref(null)
useChakraCanvas(canvasRef)
</script>

<template>
  <canvas ref="canvasRef" class="chakra-canvas"></canvas>
</template>

<style scoped>
.chakra-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
