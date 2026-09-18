<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SharinganEye from './SharinganEye.vue'
import VortexEmblem from './VortexEmblem.vue'

const emit = defineEmits(['success'])

const RANKS = [
  { value: '下忍 · Genin', label: '下忍 · Genin' },
  { value: '中忍 · Chunin', label: '中忍 · Chunin' },
  { value: '上忍 · Jonin', label: '上忍 · Jonin' },
  { value: '影 · Kage', label: '影 · Kage' }
]

const uid = ref('')
const pwd = ref('')
const rank = ref(RANKS[1].value)
const showPwd = ref(false)
const error = ref('')
const shaking = ref(false)

// 入场动画只在挂载后的短暂窗口内存在：
// 否则 shake 类移除时 animation-name 会从 shake 变回 rise，导致卡片重新播放一次入场动画
const entering = ref(true)
let enterTimer = null

const uidInput = ref(null)

onMounted(() => {
  enterTimer = setTimeout(() => {
    entering.value = false
    enterTimer = null
  }, 800)
})

onBeforeUnmount(() => {
  if (enterTimer) clearTimeout(enterTimer)
})

// 仅抖动动画结束时复位，入场动画结束不干扰
function onAnimationEnd(e) {
  if (e.animationName === 'shake') shaking.value = false
}

function fail(msg) {
  error.value = msg
  shaking.value = false
  // 强制重播抖动动画
  requestAnimationFrame(() => {
    shaking.value = true
  })
}

function onSubmit() {
  error.value = ''
  const u = uid.value.trim()
  const p = pwd.value

  if (u.length < 2) return fail('※ 識別コード至少 2 個字元')
  if (p.length < 4) return fail('※ 暗號至少 4 位，查克拉不足')

  emit('success', { uid: u, rank: rank.value })
}

function reset() {
  uid.value = ''
  pwd.value = ''
  rank.value = RANKS[1].value
  showPwd.value = false
  error.value = ''
  shaking.value = false
  uidInput.value?.focus()
}

defineExpose({ reset })
</script>

<template>
  <main class="card" :class="{ shake: shaking, entering }" @animationend="onAnimationEnd">
    <span class="corner tl"></span>
    <span class="corner tr"></span>
    <span class="corner bl"></span>
    <span class="corner br"></span>

    <SharinganEye />

    <div class="emblem-wrap">
      <VortexEmblem />
    </div>

    <h1>木葉隠れの里</h1>
    <p class="sub">ninja authentication terminal</p>

    <div class="divider">認証</div>

    <form autocomplete="off" @submit.prevent="onSubmit">
      <div class="field">
        <label for="uid"><i></i>忍者識別コード</label>
        <input
          id="uid"
          ref="uidInput"
          v-model="uid"
          type="text"
          placeholder="例：012345 / NarutoID"
          maxlength="20"
        />
      </div>

      <div class="field">
        <label for="pwd"><i></i>暗号・パスワード</label>
        <input
          id="pwd"
          v-model="pwd"
          :type="showPwd ? 'text' : 'password'"
          placeholder="请输入至少 4 位暗号"
          maxlength="32"
        />
        <button
          type="button"
          class="toggle-eye"
          :class="{ active: showPwd }"
          :aria-label="showPwd ? '隐藏密码' : '显示密码'"
          @click="showPwd = !showPwd"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <div class="field">
        <label for="rank"><i></i>忍者階級</label>
        <select id="rank" v-model="rank">
          <option v-for="r in RANKS" :key="r.value" :value="r.value">{{ r.label }}</option>
        </select>
      </div>

      <button type="submit" class="btn">結 印 · 認 証</button>
      <p class="err">{{ error }}</p>
    </form>

    <p class="hint">
      任意識別コード + 4 位以上暗号即可通過<b>查克拉核驗</b><br />
      本頁為風格演示，資訊僅存於本機瀏覽器
    </p>
  </main>
</template>

<style scoped>
.card {
  position: relative;
  z-index: 5;
  width: min(92vw, 428px);
  padding: 34px 34px 28px;
  background: linear-gradient(160deg, rgba(20, 24, 32, 0.92), rgba(8, 10, 14, 0.95));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 140, 26, 0.28);
  border-radius: 6px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.6),
    0 30px 70px rgba(0, 0, 0, 0.75),
    0 0 60px rgba(255, 140, 26, 0.09) inset;
}

/* 入场动画独立成一个类，播放完即移除，避免与 shake 互相触发重播 */
.card.entering {
  animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.25, 1) both;
}

/* 顶部光带 */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--orange), var(--chakra), transparent);
  box-shadow: 0 0 14px rgba(255, 140, 26, 0.7);
}

.corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid var(--orange);
  opacity: 0.65;
}
.corner.tl { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.corner.tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
.corner.bl { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
.corner.br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

.emblem-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 14px;
}

h1 {
  font-family: var(--font-serif);
  font-size: 27px;
  letter-spacing: 0.22em;
  text-align: center;
  font-weight: 700;
  background: linear-gradient(180deg, #fff3e0, var(--orange-soft) 55%, var(--orange-deep));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 26px rgba(255, 140, 26, 0.35);
}

.sub {
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.34em;
  color: var(--text-dim);
  margin-top: 9px;
  text-transform: uppercase;
}

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0 22px;
  color: rgba(255, 140, 26, 0.5);
  font-size: 10px;
  letter-spacing: 0.3em;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 140, 26, 0.5), transparent);
}

.field {
  position: relative;
  margin-bottom: 20px;
}

.field label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.field label i {
  width: 5px;
  height: 5px;
  background: var(--orange);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--orange);
  font-style: normal;
}

.field input,
.field select {
  width: 100%;
  padding: 11px 12px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 2px solid rgba(255, 140, 26, 0.45);
  border-radius: 3px;
  color: var(--text);
  font-size: 14px;
  letter-spacing: 0.05em;
  font-family: inherit;
  outline: none;
  transition: 0.22s;
}

.field input::placeholder {
  color: rgba(154, 160, 172, 0.5);
}

.field input:focus,
.field select:focus {
  border-color: rgba(255, 140, 26, 0.7);
  border-left-color: var(--orange);
  background: rgba(255, 140, 26, 0.07);
  box-shadow: 0 0 0 3px rgba(255, 140, 26, 0.1), 0 0 22px rgba(255, 140, 26, 0.16);
}

.field select {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' stroke='%23ff8c1a' stroke-width='1.6' fill='none' stroke-linecap='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.field select option {
  background: #121620;
  color: var(--text);
}

.toggle-eye {
  position: absolute;
  right: 10px;
  bottom: 9px;
  background: none;
  border: 0;
  cursor: pointer;
  padding: 4px;
  color: var(--text-dim);
  transition: 0.2s;
  line-height: 0;
}
.toggle-eye:hover,
.toggle-eye.active {
  color: var(--orange);
}

.btn {
  position: relative;
  width: 100%;
  margin-top: 6px;
  padding: 14px;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.34em;
  color: #1a0d02;
  background: linear-gradient(135deg, var(--orange-soft), var(--orange) 45%, var(--orange-deep));
  box-shadow: 0 6px 22px rgba(232, 98, 13, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
  overflow: hidden;
  transition: 0.25s;
}

.btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
  transform: skewX(-22deg);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(232, 98, 13, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}
.btn:hover::after {
  left: 140%;
  transition: left 0.7s ease;
}
.btn:active {
  transform: translateY(0);
}

.err {
  color: #ff6b6b;
  font-size: 11.5px;
  letter-spacing: 0.06em;
  margin-top: 12px;
  text-align: center;
  min-height: 16px;
}

/* 与 .card.entering 同特异性且定义在后，确保抖动期间覆盖入场动画 */
.card.shake {
  animation: shake 0.4s;
}

.hint {
  margin-top: 18px;
  text-align: center;
  font-size: 10.5px;
  color: rgba(154, 160, 172, 0.65);
  letter-spacing: 0.08em;
  line-height: 1.7;
}
.hint b {
  color: var(--orange-soft);
  font-weight: 600;
}

@media (max-width: 460px) {
  .card {
    padding: 26px 22px 22px;
  }
  h1 {
    font-size: 22px;
  }
}
</style>
