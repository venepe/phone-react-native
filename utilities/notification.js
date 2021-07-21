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
    .then(async (notificationToken) => {
      try {
        await postNotification({ notificationToken, token, device });
      } catch (e) {
        console.log(e);
      }
    });

    messaging().onTokenRefresh(async (notificationToken) => {
      try {
        await postNotification({ notificationToken, token, device });
      } catch (e) {
        console.log(e);
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
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
