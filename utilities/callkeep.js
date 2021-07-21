import RNCallKeep from 'react-native-callkeep';
import * as Notifications from 'expo-notifications';
import R from '../resources';

export const initCallkeep = async () => {
  const options = {
    ios: {
      appName: R.strings.TITLE_APP_NAME,
    },
    android: {
      selfManaged: true,
      cancelButton: R.strings.LABEL_CANCEL,
      okButton: R.strings.LABEL_OKAY,
      imageName: 'ic_notification',
      foregroundService: {
        channelId: 'com.venepe.anumberforus',
        channelName: R.strings.TITLE_APP_NAME,
        notificationTitle: R.strings.TITLE_APP_NAME,
        notificationIcon: 'ic_notification',
      },
    }
  };

  RNCallKeep.addEventListener('showIncomingCallUi', ({ handle, callUUID, name }) => {
    console.log(handle);
    console.log(callUUID);
    console.log(name);
    console.log('showIncomingCallUi');
    Notifications.localNotification({
      title: 'Cold Weather Alert',
      message: `It's degrees outside.`,
      playSound: true,
      soundName: 'default',
    });
  });

  await RNCallKeep.setup(options);
}
