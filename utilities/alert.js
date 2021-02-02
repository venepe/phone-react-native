import { Alert } from 'react-native';
import { copyPhoneNumber } from './copy';
import R from '../resources';

export const showConfirmPurchaseAlert = ({ phoneNumber }, callback) => {
  Alert.alert(
    R.strings.CONFIRM_PURCHASE_TITLE,
    R.strings.CONFIRM_PURCHASE_MESSAGE,
    [
      {
        text: R.strings.CONFIRM_PURCHASE_NEGATIVE ,
        style: 'cancel',
      },
      {
        text: R.strings.CONFIRM_PURCHASE_AFFIRMATIVE,
        onPress: () => callback({ phoneNumber }),
      },
    ],
    { cancelable: true }
  );
}

export const showCongratulationsAlert = () => {
  Alert.alert(
    R.strings.CONGRATULATIONS_TITLE,
    R.strings.CONGRATULATIONS_MESSAGE,
    [
      {
        text: R.strings.LABEL_COPY_NUMBER,
        onPress: () => copyPhoneNumber(),
      },
      {
        text: R.strings.LABEL_MAYBE_LATER,
      },
    ],
    { cancelable: true }
  );
}
