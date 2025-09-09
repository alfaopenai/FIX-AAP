import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fixi.app',
  appName: 'Fixi App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Add any Capacitor plugins configuration here
  }
};

export default config; 