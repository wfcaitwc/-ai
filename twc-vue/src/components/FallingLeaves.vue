<script setup>
import { ref } from 'vue'

const COLORS = ['#ff8c1a', '#e8620d', '#c94a06', '#ffb765', '#8a5a1a']
const COUNT = 12

const rand = (min, max) => Math.random() * (max - min) + min

// 每片叶子的随机参数在初始化时生成一次，避免每帧重算
const leaves = ref(
  Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    size: Math.round(rand(10, 22)),
    color: COLORS[i % COLORS.length],
    style: {
      left: `${rand(0, 100)}vw`,
      animationDuration: `${rand(9, 18)}s`,
      animationDelay: `${-rand(0, 16)}s`,
      '--dx': `${rand(-80, 80)}px`,
      '--rot': `${rand(360, 1260)}deg`
    }
  }))
)
</script>

<template>
  <div class="leaves" aria-hidden="true">
    <div v-for="leaf in leaves" :key="leaf.id" class="leaf" :style="leaf.style">
      <svg :width="leaf.size" :height="leaf.size" viewBox="0 0 24 24">
        <path
          d="M12 2C6 5 3 11 4 17c3 4 9 4 13 1 3-2 4-7 2-11-1-2-4-4-7-5z"
          :fill="leaf.color"
          opacity=".85"
        />
        <path d="M12 2v20" stroke="rgba(0,0,0,.28)" stroke-width="1" fill="none" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.leaves {
  position: fixed;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.leaf {
  position: absolute;
  top: -60px;
  opacity: 0;
  animation: fall linear infinite;
}

.leaf svg {
  display: block;
}
</style>
