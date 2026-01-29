import type { CapacitorConfig } from '@anthropic/capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.dextrend.app',
    appName: 'DexTrend',
    webDir: 'out',
    server: {
        androidScheme: 'https'
    },
    android: {
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: true
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#0d0d0d',
            androidSplashResourceName: 'splash',
            showSpinner: false
        },
        StatusBar: {
            style: 'DARK',
            backgroundColor: '#0d0d0d'
        }
    }
};

export default config;
