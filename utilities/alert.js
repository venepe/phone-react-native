import { Alert } from 'react-native';
import { copyPhoneNumber } from './copy';
import { getFormattedNumber } from './phone';
import R from '../resources';

export const showConfirmPurchaseAlert = ({ phoneNumber }, callback) => {
  const formattedNumber = getFormattedNumber(phoneNumber);
  Alert.alert(
    `Reserve ${formattedNumber}?`,
    `Do you want to use ${formattedNumber} as your phone number?`,
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

export const showConfirmJoinAlert = ({}, callback) => {
  Alert.alert(
    `Join Your Partner?`,
    `Do you want to join your partner on a phone number?`,
    [
      {
        text: R.strings.CONFIRM_PURCHASE_NEGATIVE ,
        style: 'cancel',
      },
      {
        text: R.strings.CONFIRM_PURCHASE_AFFIRMATIVE,
        onPress: () => callback({ }),
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
