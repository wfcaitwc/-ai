<script setup>
/** 木叶漩涡徽章（风格化螺旋 + 双层反向旋转环） */
</script>

<template>
  <div class="emblem">
    <span class="ring"></span>
    <span class="ring two"></span>
    <svg class="vortex" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="vortex-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffd9a0" />
          <stop offset="50%" stop-color="#ff8c1a" />
          <stop offset="100%" stop-color="#c94a06" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#vortex-gradient)" stroke-width="6" stroke-linecap="round">
        <path
          d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 0 10 -10 a18 18 0 1 1 -18 18 a26 26 0 1 0 26 -26 a34 34 0 1 1 -34 34"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.emblem {
  width: 78px;
  height: 78px;
  position: relative;
  display: grid;
  place-items: center;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 140, 26, 0.35);
  animation: spin 22s linear infinite;
}

.ring.two {
  inset: 7px;
  border-style: dashed;
  border-color: rgba(63, 208, 255, 0.28);
  animation-duration: 14s;
  animation-direction: reverse;
}

.vortex {
  width: 52px;
  height: 52px;
  animation: spin 32s linear infinite;
  filter: drop-shadow(0 0 10px rgba(255, 140, 26, 0.55));
}
</style>
