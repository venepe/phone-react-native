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

export const showCompletedTodo = ({ name }) => {
  let message = name;
  let description = R.strings.LABEL_TASK_COMPLETED;
  RNFlashMessage.showMessage({
    message,
    description,
    type: 'default',
    backgroundColor: R.colors.YES,
    color: R.colors.TEXT_MAIN,
    autoHide: true,
    duration: 3200
  });
}

export const showCompletedEssential = ({ name }) => {
  let message = name;
  let description = R.strings.LABEL_ESSENTIAL_COMPLETED;
  RNFlashMessage.showMessage({
    message,
    description,
    type: 'default',
    backgroundColor: R.colors.YES,
    color: R.colors.TEXT_MAIN,
    autoHide: true,
    duration: 3200
  });
}

export const hideMessage = () => {
  RNFlashMessage.hideMessage();
}
