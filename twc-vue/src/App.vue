<script setup>
import { ref } from 'vue'
import ChakraBackground from './components/ChakraBackground.vue'
import FallingLeaves from './components/FallingLeaves.vue'
import LoginCard from './components/LoginCard.vue'
import SealOverlay from './components/SealOverlay.vue'

const cardRef = ref(null)
const overlayVisible = ref(false)
const currentUser = ref({ uid: '', rank: '' })

function handleSuccess({ uid, rank }) {
  currentUser.value = { uid, rank }
  overlayVisible.value = true
}

function handleClose() {
  overlayVisible.value = false
  cardRef.value?.reset()
}
</script>

<template>
  <ChakraBackground />
  <div class="grid-overlay"></div>
  <FallingLeaves />
  <div class="vignette"></div>

  <LoginCard ref="cardRef" @success="handleSuccess" />

  <SealOverlay
    :visible="overlayVisible"
    :uid="currentUser.uid"
    :rank="currentUser.rank"
    @close="handleClose"
  />
</template>

<style scoped>
.grid-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 140, 26, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 140, 26, 0.045) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 78%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 78%);
}

.vignette {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.72) 100%);
}
</style>
