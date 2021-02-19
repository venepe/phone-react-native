import { Alert } from 'react-native';
import { copyPhoneNumber } from './copy';
import { getFormattedNumber } from './phone';
import R from '../resources';

export const showConfirmPurchaseAlert = ({ phoneNumber }, purchase, cancel = () => {}) => {
  const formattedNumber = getFormattedNumber(phoneNumber);
  Alert.alert(
    `Reserve ${formattedNumber}?`,
    `Do you want to use ${formattedNumber} as your phone number?`,
    [
      {
        text: R.strings.CONFIRM_PURCHASE_NEGATIVE ,
        style: 'cancel',
        onPress: () => cancel(),
      },
      {
        text: R.strings.CONFIRM_PURCHASE_AFFIRMATIVE,
        onPress: () => purchase({ phoneNumber }),
      },
    ],
    { cancelable: false }
  );
}

export const showConfirmJoinAlert = ({ owners, phoneNumber }, purchase, cancel) => {
  const formattedNumber = getFormattedNumber(phoneNumber);
  let nameText = 'your partner';
  if (owners && owners.length > 0) {
    nameText = owners[0].name;
  }

  Alert.alert(
    `Join ${formattedNumber}?`,
    `Do you want to join ${nameText} on a phone number?`,
    [
      {
        text: R.strings.CONFIRM_PURCHASE_NEGATIVE ,
        style: 'cancel',
        onPress: () => cancel(),
      },
      {
        text: R.strings.CONFIRM_PURCHASE_AFFIRMATIVE,
        onPress: () => purchase({ }),
      },
    ],
    { cancelable: false }
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
