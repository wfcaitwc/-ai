<script setup>
/** 写轮眼（风格化：红瞳 + 三勾玉），持续缓慢旋转 */
</script>

<template>
  <svg class="sharingan" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke="#d32f2f" stroke-width="4" />
    <circle cx="50" cy="50" r="39" fill="none" stroke="#8e1b1b" stroke-width="1.5" />
    <circle cx="50" cy="50" r="14" fill="#1a0505" stroke="#d32f2f" stroke-width="3" />
    <g fill="#d32f2f">
      <path d="M50 20c7 6 9 15 4 22-6-4-9-13-4-22z" transform="rotate(0 50 50)" />
      <path d="M50 20c7 6 9 15 4 22-6-4-9-13-4-22z" transform="rotate(120 50 50)" />
      <path d="M50 20c7 6 9 15 4 22-6-4-9-13-4-22z" transform="rotate(240 50 50)" />
    </g>
  </svg>
</template>

<style scoped>
.sharingan {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  animation: spin 9s linear infinite;
  opacity: 0.85;
  filter: drop-shadow(0 0 8px rgba(211, 47, 47, 0.6));
}
</style>
