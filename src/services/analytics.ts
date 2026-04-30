import {init, trackEvent as aptabaseTrackEvent} from '@aptabase/web';

const aptabaseKey = import.meta.env.VITE_PUBLIC_APTABASE;

export enum Events {
  OPEN = 'open',
  ROLL = 'roll',
  RESET = 'reset',
  VIEW_STATS = 'viewSstats',
  CHANGE_SET = 'changeSet',
}

export const initAnalytics = () => {
  if (!aptabaseKey) return;
  init(aptabaseKey);
};

export const trackEvent = (
  event: Events,
  props?: Record<string, string | number | boolean>,
) => {
  if (!aptabaseKey) return;
  aptabaseTrackEvent(event, props);
};
