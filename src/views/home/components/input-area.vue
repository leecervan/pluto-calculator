<template>
  <div
    class="calc-input-area"
    @click="handleKeyInput"
    :style="{ height: inputHeight + 'px' }"
  >
    <div class="calc-key__wrapper" :style="keyWrapperStyle">
      <div
        class="calc-key"
        v-for="code in baseKeysMap"
        :key="code.text"
        :style="keyStyle"
      >
        <div class="calc-key__wrapper">
          <span class="calc-key__btn" :class="code.alias">{{ code.text }}</span>
          <span class="calc-key__mask" v-show="isKeyPress(code.text)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { baseKeysMap } from './keysMap';

const props = defineProps<{
  inputHeight: number;
  activatedBtn: string;
}>();

const emit = defineEmits(['key-input']);

const inputWidth = computed(() => props.inputHeight * 0.8);
const keyStyle = computed(() => ({
  width: inputWidth.value / 4 + 'px',
  height: inputWidth.value / 4 + 'px',
  lineHeight: inputWidth.value / 4 - 20 + 'px',
}));
const keyWrapperStyle = computed(() => ({
  width: inputWidth.value + 'px',
  height: props.inputHeight + 'px',
}));

const handleKeyInput = (e: Event) => emit('key-input', e);

const isKeyPress = (btn: string) => {
  return props.activatedBtn === btn;
};
</script>
