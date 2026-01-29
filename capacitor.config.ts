import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.dextrend.app',
    appName: 'DexTrend',
    webDir: 'out',
    server: {
        androidScheme: 'https'
    }
};

export default config;
