import ExpoMixpanelAnalytics from '@benawad/expo-mixpanel-analytics';
import { MIXPANEL_TOKEN } from './config';

const analytics = () => {
  if (__DEV__) {
    return {
      identify: () => {},
      track: () => {},
      people_set: () => {},
      people_set_once: () => {},
      people_unset: () => {},
      people_increment: () => {},
      people_append: () => {},
      people_union: () => {},
      people_delete_user: () => {},
      reset: () => {},
    };
  } else {
    const mixpanel = new ExpoMixpanelAnalytics(MIXPANEL_TOKEN);
    return mixpanel;
  }
}

export const EVENTS = {
  ERROR: 'Error',
}

export default analytics();
