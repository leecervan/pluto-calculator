<template>
  <div
    class="calc-output-area"
    :style="{
      height: outputHeight + 'px',
      lineHeight: outputHeight * 0.5 + 'px',
      fontSize: fontSize + 'px',
    }"
  >
    <div class="show-formula">
      <slot name="formula"></slot>
    </div>
    <div class="show-result">
      <slot name="result"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  outputHeight: number;
  fontSize: number;
}>();
</script>
