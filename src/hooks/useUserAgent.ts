import isMobile from 'ismobilejs';

export default function useUserAgent(userAgent: string) {
  const { phone, tablet } = isMobile(userAgent);

  return {
    isPhone: phone,
    isTablet: tablet,
  };
}
