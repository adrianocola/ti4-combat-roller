import Aptabase from '@aptabase/react-native';

export enum Events {
  OPEN = 'open',
  ROLL = 'roll',
  RESET = 'reset',
  STATS = 'stats',
}

export const initAnalytics = () => {
  // @ts-ignore
  Aptabase.init(process.env.EXPO_PUBLIC_APTABASE);
};

export const trackEvent = (
  event: string,
  props: Record<string, string | number | boolean>,
) => {
  Aptabase.trackEvent(event, props);
};
