import {ConfigContext, ExpoConfig} from '@expo/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  // @ts-ignore
  name: process.env.NAME,
  // @ts-ignore
  slug: process.env.SLUG,
  // @ts-ignore
  version: process.env.VERSION,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#161616',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    // @ts-ignore
    bundleIdentifier: process.env.IOS_BUNDLE_ID,
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#161616',
    },
    // @ts-ignore
    package: process.env.ANDROID_PACKAGE,
    permissions: ['android.permission.INTERNET'],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      // @ts-ignore
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
});
