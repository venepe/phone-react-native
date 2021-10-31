import * as RNFlashMessage from 'react-native-flash-message';
import * as RootNavigation from '../components/App/RootNavigation';
import { getStore } from '../store';
import { joinActiveCall } from '../actions';
import { getReadableNumber } from './phone';
import R from '../resources';

export const showActiveCallMessage = async ({ activePhoneNumber }) => {
  let message = 'Ongoing call';
  let description = 'Tap to join';
  if (activePhoneNumber && activePhoneNumber.length > 0) {
    let activePhoneNumberFormatted = await getReadableNumber(activePhoneNumber);
    description = `${activePhoneNumberFormatted}`;
  }
  RNFlashMessage.showMessage({
    message,
    description,
    type: 'default',
    backgroundColor: R.colors.YES,
    color: R.colors.TEXT_MAIN,
    autoHide: false,
    onPress: () => {
      getStore().dispatch(joinActiveCall());
      RootNavigation.navigate('CallStates', {
        screen: 'ActiveCall',
        params: { },
      });
    }
  });
}

export const showCompleted = () => {
  let message = R.strings.LABEL_COMPLETED;
  RNFlashMessage.showMessage({
    message,
    type: 'default',
    backgroundColor: R.colors.YES,
    color: R.colors.TEXT_MAIN,
    autoHide: true,
  });
}

export const hideMessage = () => {
  RNFlashMessage.hideMessage();
}
