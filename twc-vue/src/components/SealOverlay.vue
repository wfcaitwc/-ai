<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  uid: { type: String, default: '' },
  rank: { type: String, default: '' }
})

const emit = defineEmits(['close'])

/** 十二地支结印顺序 */
const SEALS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const SEAL_INTERVAL = 170
const SUCCESS_DELAY = 380

const index = ref(-1)
const showSuccess = ref(false)

let sealTimer = null
let successTimer = null

function clearTimers() {
  if (sealTimer) clearInterval(sealTimer)
  if (successTimer) clearTimeout(successTimer)
  sealTimer = null
  successTimer = null
}

function start() {
  clearTimers()
  index.value = -1
  showSuccess.value = false

  let i = 0
  sealTimer = setInterval(() => {
    if (i >= SEALS.length) {
      clearInterval(sealTimer)
      sealTimer = null
      successTimer = setTimeout(() => {
        showSuccess.value = true
        successTimer = null
      }, SUCCESS_DELAY)
      return
    }
    index.value = i
    i += 1
  }, SEAL_INTERVAL)
}

watch(
  () => props.visible,
  (v) => {
    if (v) start()
    else clearTimers()
  }
)

onBeforeUnmount(clearTimers)

const currentSeal = computed(() => SEALS[Math.max(index.value, 0)])
const label = computed(() =>
  showSuccess.value ? '術式發動' : `第 ${index.value + 1} 印 / 十二`
)
</script>

<template>
  <Transition name="overlay">
    <div v-if="visible" class="overlay">
      <!-- 结印阶段 -->
      <div v-show="!showSuccess" class="seal-stage">
        <!-- :key 变化使元素重建，从而重播 pop 动画 -->
        <div :key="currentSeal" class="seal-char">{{ currentSeal }}</div>
        <div class="seal-label">{{ label }}</div>
        <div class="seal-track">
          <span v-for="(s, i) in SEALS" :key="s" :class="{ lit: i <= index }"></span>
        </div>
      </div>

      <!-- 认证成功 -->
      <div v-if="showSuccess" class="success">
        <div class="mark">
          <svg
            width="46"
            height="46"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff8c1a"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2>認証成功</h2>
        <p class="who">歡迎回來，<em>{{ uid }}</em></p>
        <div class="rank">{{ rank }}</div>
        <br />
        <button type="button" class="btn ghost" @click="emit('close')">返 回 村 口</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: radial-gradient(circle at 50% 50%, rgba(30, 10, 0, 0.94), rgba(0, 0, 0, 0.97));
  display: grid;
  place-items: center;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.seal-stage {
  text-align: center;
}

.seal-char {
  font-family: var(--font-serif);
  font-size: 96px;
  font-weight: 700;
  color: var(--orange);
  text-shadow: 0 0 40px rgba(255, 140, 26, 0.8), 0 0 90px rgba(255, 140, 26, 0.4);
  animation: pop 0.16s ease-out both;
}

.seal-label {
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.5em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.seal-track {
  display: flex;
  gap: 7px;
  justify-content: center;
  margin-top: 24px;
}

.seal-track span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  transition: 0.16s;
}

.seal-track span.lit {
  background: var(--orange);
  box-shadow: 0 0 12px var(--orange);
  transform: scale(1.35);
}

.success {
  text-align: center;
  animation: rise 0.5s both;
}

.success .mark {
  width: 96px;
  height: 96px;
  margin: 0 auto 20px;
  border-radius: 50%;
  border: 2px solid var(--orange);
  display: grid;
  place-items: center;
  box-shadow: 0 0 50px rgba(255, 140, 26, 0.45), 0 0 0 8px rgba(255, 140, 26, 0.07);
  animation: pulse 1.8s ease-in-out infinite;
}

.success h2 {
  font-family: var(--font-serif);
  font-size: 30px;
  letter-spacing: 0.3em;
  color: var(--orange-soft);
  text-shadow: 0 0 34px rgba(255, 140, 26, 0.6);
}

.success .who {
  margin-top: 16px;
  font-size: 13px;
  color: var(--text);
  letter-spacing: 0.12em;
}

.success .who em {
  font-style: normal;
  color: var(--chakra);
}

.success .rank {
  display: inline-block;
  margin-top: 14px;
  padding: 6px 16px;
  border: 1px solid rgba(255, 140, 26, 0.5);
  border-radius: 2px;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: var(--orange-soft);
  background: rgba(255, 140, 26, 0.08);
}

.btn.ghost {
  margin-top: 30px;
  width: auto;
  padding: 11px 30px;
  background: transparent;
  color: var(--orange-soft);
  border: 1px solid rgba(255, 140, 26, 0.45);
  box-shadow: none;
  font-size: 12px;
}

.btn.ghost:hover {
  background: rgba(255, 140, 26, 0.12);
  box-shadow: 0 0 26px rgba(255, 140, 26, 0.22);
}

@media (max-width: 460px) {
  .seal-char {
    font-size: 70px;
  }
}
</style>
