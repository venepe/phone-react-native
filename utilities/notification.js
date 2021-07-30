import { AsyncStorage, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Keys from '../constants/Keys';
import { postNotification } from '../fetches';
import * as RootNavigation from '../components/App/RootNavigation';
import { getStore } from '../store';
import { setActivePhoneNumber } from '../actions';

const TWILIO_CALL = 'twilio.voice.call';

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
      const { data } = remoteMessage;
      if (data.twi_account_sid) {
        const { twi_from: activePhoneNumber, twi_message_type } = data;
        if (twi_message_type === TWILIO_CALL) {
          getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
          RootNavigation.navigate('CallStates', {
            screen: 'IncomingCall',
            params: { },
          });
        }
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
    const { type } = remoteMessage.data;
    const { title, body } = remoteMessage.data;
    console.log(remoteMessage.data);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        const { type } = remoteMessage.data;
        console.log(remoteMessage.data);
      }
    });

  messaging().onMessage(remoteMessage => {
    const { type } = remoteMessage.data;
    console.log(remoteMessage.data);
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
