import Aptabase from '@aptabase/react-native';

// @ts-ignore
const aptabaseKey = process.env.EXPO_PUBLIC_APTABASE;

export enum Events {
  OPEN = 'open',
  ROLL = 'roll',
  RESET = 'reset',
  VIEW_STATS = 'viewSstats',
  CHANGE_SET = 'changeSet',
}

export const initAnalytics = () => {
  if (!aptabaseKey) {
    return;
  }

  Aptabase.init(aptabaseKey);
};

export const trackEvent = (
  event: Events,
  props?: Record<string, string | number | boolean>,
) => {
  if (!aptabaseKey) {
    return;
  }

  Aptabase.trackEvent(event, props);
};
