import { Alert } from 'react-native';
import { postResendVerificationEmail } from '../fetches';
import { copyPhoneNumber } from './copy';
import { getFormattedNumber } from './phone';
import R from '../resources';

export const showNoAccountAlert = () => {
  Alert.alert(
    R.strings.ERROR_REQUEST_TITLE,
    R.strings.LABEL_DONT_HAVE_LINE,
    [
      {
        text: R.strings.LABEL_OKAY,
        style: 'cancel',
      },
    ],
    { cancelable: false }
  );
}

export const showVerifyEmailAddressSuccessAlert = () => {
  Alert.alert(
    R.strings.LABEL_RESEND_EMAIL_SUCCESS_TITLE,
    R.strings.LABEL_RESEND_EMAIL_SUCCESS_MESSAGE,
    [
      {
        text: R.strings.LABEL_OKAY,
        style: 'cancel',
      },
    ],
    { cancelable: false }
  );
}

export const showVerifyEmailAddressAlert = ({ token }) => {
  Alert.alert(
    R.strings.LABEL_RESEND_EMAIL_TITLE,
    R.strings.LABEL_RESEND_EMAIL_MESSAGE,
    [
      {
        text: R.strings.LABEL_CANCEL,
        style: 'cancel',
      },
      {
        text: R.strings.LABEL_RESEND,
        onPress: async () => {
          try {
            await postResendVerificationEmail({ token });
            showVerifyEmailAddressSuccessAlert();
          } catch (e) {
            console.log(e);
          }
        },
      },
    ],
    { cancelable: false }
  );
}

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
  let nameText = '';
  let length = owners.length;
  if (owners && length > 0) {
    if (length === 1) {
      nameText = owners[0].name;
    } else if (length === 2) {
      nameText = `${owners.map(({ name }) => name).join(' and ')}`;
    } else {
      const maxLength = 3;
      if (length > maxLength) {
        owners.splice(maxLength, length - maxLength);
        owners.push({ name: 'others' });
      }
      const last = owners.pop();
      nameText = `${owners.map(({ name }) => name).join(', ')}, and ${last.name}`;
    }
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
