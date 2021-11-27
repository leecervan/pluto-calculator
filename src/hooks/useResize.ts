import { ref, onMounted, onUnmounted } from 'vue';

function getBrowserInterfaceSize() {
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;

  if (typeof screenWidth != 'number') {
    //在标准模式下面
    if (document.compatMode == 'CSS1Compat') {
      screenWidth = document.documentElement.clientWidth;
      screenHeight = document.documentElement.clientHeight;
    } else {
      screenWidth = document.body.clientWidth;
      screenHeight = document.body.clientHeight;
    }
  }

  return {
    screenWidth,
    screenHeight,
  };
}

export default function useResize() {
  const screenWidth = ref(0);
  const screenHeight = ref(0);
  const handler = () => {
    const size = getBrowserInterfaceSize();
    screenWidth.value = size.screenWidth;
    screenHeight.value = size.screenHeight;
    // console.log(screenWidth, screenHeight);
  };

  handler();

  onMounted(() => {
    window.addEventListener('resize', handler);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handler);
  });

  return {
    screenWidth,
    screenHeight,
  };
}
