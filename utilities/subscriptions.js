import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

export const manageSubscription = () => {
  if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
  } else {
    Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.venepe.phone');
  }
}
