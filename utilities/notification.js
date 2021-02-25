import { AsyncStorage, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Keys from '../constants/Keys';
import { postNotification } from '../fetches';

export const initializeNotifications = async () => {
  const token = await AsyncStorage.getItem(Keys.TOKEN_KEY);
  await requestUserPermission();
  const device = Platform.OS;
  messaging()
    .getToken()
    .then((notificationToken) => {
      console.log(notificationToken);
      try {
        postNotification({ notificationToken, token, device });
      } catch (e) {
        console.log(e);
      }
    });

    messaging().onTokenRefresh((notificationToken) => {
      try {
        postNotification({ notificationToken, token, device });
      } catch (e) {
        console.log(e);
      }
    });
};

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}
