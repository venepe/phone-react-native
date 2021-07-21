import RNCallKeep from 'react-native-callkeep';
import R from '../resources';

export const initCallkeep = async () => {
  const options = {
    ios: {
      appName: R.strings.TITLE_APP_NAME,
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
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
  await RNCallKeep.setup(options);
}
