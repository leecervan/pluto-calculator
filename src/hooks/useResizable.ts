import { ref } from 'vue';
import useResize from './useResize';
import useUserAgent from './useUserAgent';

// 根据用户屏幕获取更优的 app 尺寸
export default function useResizable(userAgent: string) {
  const { isPhone, isTablet } = useUserAgent(userAgent);
  const { screenWidth, screenHeight } = useResize();
  // 满尺寸比例
  const xRatio = 4;
  const yRatio = 7;

  const inputHeight = ref(0);
  const outputHeight = ref(0);

  // console.log('useResizable:', screenWidth.value, screenHeight.value);
  if (screenHeight.value / screenWidth.value < yRatio / xRatio) {
    inputHeight.value = (screenHeight.value / 7) * 5;
    outputHeight.value = (screenHeight.value / 7) * 2;
  } else {
    inputHeight.value = screenWidth.value * 1.25;
    outputHeight.value = screenWidth.value * 0.5;
  }

  // 更细粒度的控制
  if (isPhone) {
    // 手机
  } else if (isTablet) {
    // 平板
  } else {
    // PC
  }

  return {
    screenWidth,
    screenHeight,
    inputHeight,
    outputHeight,
  };
}
