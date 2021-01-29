import { AsyncStorage } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { showMessage, hideMessage } from 'react-native-flash-message';
import Keys from '../constants/Keys';
import R from '../resources';

export const copyPhoneNumber = async () => {
  const phoneNumber = await AsyncStorage.getItem(Keys.PHONE_NUMBER_KEY);
  Clipboard.setString(phoneNumber);
  showMessage({
    message: `${phoneNumber} copied!`,
    type: 'default',
    backgroundColor: R.colors.SUCCESS,
    color: R.colors.TEXT_MAIN,
    duration: 3000,
  });
}
