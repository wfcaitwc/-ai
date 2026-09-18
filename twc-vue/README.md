# 木叶隐村 · 忍者认证终端（Vue 3 版）

火影忍者风格登录页，由单文件 HTML 改造为 **Vue 3 + Vite** 工程。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建，输出到 dist/
npm run build

# 预览构建产物
npm run preview
```

> `vite.config.js` 中已设置 `base: './'`，构建出的 `dist/index.html` 可直接双击打开。

## 目录结构

```
twc-vue/
├─ index.html                  入口 HTML
├─ vite.config.js              Vite 配置
├─ package.json
└─ src/
   ├─ main.js                  应用入口
   ├─ App.vue                  根组件：组合各层
   ├─ styles/
   │  └─ main.css              设计变量 / 重置 / 全局动画关键帧
   ├─ composables/
   │  └─ useChakraCanvas.js    查克拉粒子 + 漩涡 canvas 逻辑
   └─ components/
      ├─ ChakraBackground.vue  背景 canvas（螺旋 + 粒子）
      ├─ FallingLeaves.vue     飘落树叶（12 片，随机参数）
      ├─ VortexEmblem.vue      木叶漩涡徽章（SVG）
      ├─ SharinganEye.vue      写轮眼（SVG，缓慢旋转）
      ├─ LoginCard.vue         登录卡片与表单校验
      └─ SealOverlay.vue       十二印结印动画 + 认证成功页
```

## 改造要点

| 原 HTML | Vue 改造 |
| --- | --- |
| 全局 `<style>` | `src/styles/main.css` + 组件 `<style scoped>` |
| 内联 `<script>` 操作 DOM | Vue 响应式数据 + `v-model` / `v-if` / `v-for` |
| `document.createElement` 生成树叶 | `v-for` 渲染，参数在 `setup` 中生成一次 |
| `classList.add('shake')` | `:class="{ shake }"` + `@animationend` 复位 |
| `setInterval` 驱动结印 | `watch` props + `computed`，卸载时自动清理定时器 |
| `setInterval` 直接改 DOM | `:key` 变更触发 CSS 动画重播 |
| — | `Transition` 组件实现遮罩淡入淡出 |

## 交互说明

- 识别码至少 **2** 个字符，暗号至少 **4** 位，否则卡片抖动并提示
- 校验通过 → 播放十二地支结印（子→亥，每印 170ms）→ 显示「認証成功」
- 点击「返回村口」清空表单并回到登录态
- 数据仅存于内存，无任何后端请求

## 技术栈

- Vue 3.5（Composition API + `<script setup>`）
- Vite 5
- 零 UI 库、零外部素材，全部图形为 CSS / SVG / Canvas 绘制
