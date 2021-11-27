<template>
  <div class="calc" :class="[{ 'is-phone': isPhone, 'is-tablet': isTablet }]">
    <div class="calc-empty-area"></div>
    <output-area :font-size="fontSize" :outputHeight="outputHeight">
      <template #formula>
        <span ref="showFormula">{{ formula }}</span>
      </template>
      <template #result>
        <span ref="showResult">{{ result }}</span>
      </template>
    </output-area>
    <input-area
      :inputHeight="inputHeight"
      :activated-btn="activatedBtn"
      @key-input="handleKeyInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick } from 'vue';
import InputArea from './components/input-area.vue';
import OutputArea from './components/output-area.vue';
import useUserAgent from '@/hooks/useUserAgent';
import useResizable from '@/hooks/useResizable';
import {
  isKeyClear,
  isKeyEqual,
  isValidSymbolAppended,
  isValidFormula,
  calc,
  isKeyOperator,
} from '@/utils';

import { Notify } from 'vant';
import 'vant/es/notify/style';

const { isPhone, isTablet } = useUserAgent(navigator.userAgent);
// 根据设备比例计算、返回两个区域的高度
const { inputHeight, outputHeight, screenWidth, screenHeight } = useResizable(
  navigator.userAgent
);

// 初始化屏幕，不允许滑动
document.body.style.width = screenWidth.value + 'px';
document.body.style.height = screenHeight.value + 'px';

const defaultFontSize = outputHeight.value * 0.3;
const formula = ref(''); // 公式
const result = ref(0); // 结果
const hasResult = ref(false); // 下次计算是否应用上次的结果
const fontSize = ref(defaultFontSize);
const activatedBtn = ref('');

const showFormula = ref<HTMLElement | null>(null);
const showResult = ref<HTMLElement | null>(null);

const outputWidth = computed(
  () => Math.max(screenWidth.value, inputHeight.value) * 0.8
);

// AC 清空
const refresh = () => {
  formula.value = '';
  result.value = 0;
  hasResult.value = false;
  fontSize.value = defaultFontSize;
  showFormula.value &&
    (showFormula.value.style.fontSize = defaultFontSize + 'px');
  showResult.value &&
    (showResult.value.style.fontSize = defaultFontSize + 'px');
};

// = 计算结果
const exec = () => {
  result.value = calc(formula.value);
  formula.value += '=';
  hasResult.value = true;
};

watch(formula, () => {
  if (!showFormula.value) return;
  if (formula.value === '') return; // reset()
  setFontSize(showFormula.value, outputWidth.value - 20, 30);
});

watch(result, () => {
  // if (!showResult.value) return;
  if (result.value === 0) return; // reset()
  // FIX: 在 result 触发视图更新后才能获取区域的真实宽度
  nextTick(() => {
    setFontSize(showResult.value, outputWidth.value - 20, 30);
  });
});

// 逐步调整 el 的字体，以便其能自适应于容器中
function setFontSize(
  el: HTMLElement | null,
  maxWidth: number,
  threshold: number
) {
  if (!el) return;
  let currentWidth = el.getBoundingClientRect().width;
  let fontSize = parseInt(getComputedStyle(el).fontSize);
  if (currentWidth + threshold < maxWidth) {
    // 已经是最大字体
    return;
    /* if (fontSize >= defaultFontSize) return;
    // 适当增大字体
    while (
      currentWidth + threshold < maxWidth &&
      fontSize + 1 < defaultFontSize
    ) {
      fontSize += 1;
      el.style.fontSize = fontSize + 'px';
      currentWidth = el.getBoundingClientRect().width;
      // console.log(fontSize, currentWidth, maxWidth);
    } */
  } else {
    // 已经是最小字体
    if (fontSize <= 14) {
      // TODO 设置省略号样式
      return;
    }
    // 适当缩小字体
    while (currentWidth + threshold > maxWidth && fontSize - 1 > 14) {
      fontSize -= 1;
      el.style.fontSize = fontSize + 'px';
      currentWidth = el.getBoundingClientRect().width;
      // console.log(fontSize, currentWidth, maxWidth);
    }
  }
}

// 事件处理函数
const handleKeyInput = (e: Event) => {
  // 处理空白区域
  if (!e.target || (e.target as HTMLElement).tagName !== 'SPAN') return;
  const val = (e.target as HTMLElement).textContent || '';
  activatedBtn.value = val;
  // TODO 使用更好的 UI 触发方式
  setTimeout(() => {
    activatedBtn.value = '';
  }, 200);
  if (isKeyClear(val)) {
    // 清空
    refresh();
  } else if (isKeyEqual(val)) {
    // 计算
    isValidFormula(formula.value)
      ? exec()
      : Notify({
          message: '公式错误',
          duration: 500,
        });
  } else {
    // 如果是根据上次结果计算，则选择更新 formula
    if (hasResult.value) {
      formula.value = isKeyOperator(val) ? result.value + '' : '';
      hasResult.value = false;
    }
    // 拼接
    isValidSymbolAppended(formula.value, val)
      ? (formula.value += val)
      : Notify({
          message: '无效操作',
          duration: 500,
        });
  }
};
</script>
