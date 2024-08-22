import {ConfigContext, ExpoConfig} from '@expo/config';

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  // @ts-ignore
  owner: config?.owner ?? process.env.OWNER ?? 'adrianocola',
  // @ts-ignore
  name: config?.name ?? process.env.NAME ?? 'TI4 Combat Roller',
  // @ts-ignore
  slug: config?.slug ?? process.env.SLUG ?? 'ti4-combat-roller',
  // @ts-ignore
  version: config?.version ?? process.env.VERSION ?? '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#161616',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier:
      // @ts-ignore
      config?.ios?.bundleIdentifier ?? process.env.IOS_BUNDLE_ID,
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
    package: config?.android?.package ?? process.env.ANDROID_PACKAGE,
    permissions: ['android.permission.INTERNET'],
  },
  runtimeVersion:
    // @ts-ignore
    config?.runtimeVersion ?? process.env.RUNTIME_VERSION ?? '1.0.0',
  extra: {
    eas: {
      // @ts-ignore
      projectId: config?.extra?.eas?.projectId ?? process.env.EAS_PROJECT_ID,
    },
  },
  updates: {
    // @ts-ignore
    url: config?.updates?.url ?? process.env.UPDATE_URL,
  },
});
