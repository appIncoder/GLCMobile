import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mobile.app.glcbaudour.be',
  appName: 'GLC Baudour',
  webDir: 'www',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffff',
      overlaysWebView: false,
    },
    SafeArea: {
      customColorsForSystemBars: true,
    },
  },
};

export default config;
