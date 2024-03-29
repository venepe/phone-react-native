import { AsyncStorage, Platform } from 'react-native';
import * as Facebook from 'expo-facebook';
import TwilioVoice from 'react-native-twilio-programmable-voice';
import Keys from '../constants/Keys';
import AppTypes from '../constants/AppTypes';
import CallTypes from '../constants/CallTypes';
import OwnerTypes from '../constants/OwnerTypes';
import UserTypes from '../constants/UserTypes';
import { getStore } from '../store';
import { getActivationToken, getCalls, getMessages, getOwners } from '../fetches';
import analytics from '../analytics';
import { refreshToken } from '../utilities/auth';
import { showActiveCallMessage, hideMessage } from '../utilities/flash-message';
import { requestMicrophonePermission } from '../utilities/permissions';
import { closeSocket } from '../utilities/socket';
import { registerTwilioVoiceEvents, checkActiveOrIncomingCalls } from '../utilities/twilio-voice';
import { FACEBOOK_APP_ID } from '../config';
import R from '../resources';

export const requestOwners = () =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const data = await getOwners({ token, accountId }) || {};
    let { owners } = data;
    dispatch(setOwners({ payload: { owners } }));
  }

export const requestMessages = () =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const data = await getMessages({ token, accountId }) || {};
    let { messages } = data;
    dispatch(setMessages({ payload: { messages } }));
  }

export const requestCalls = () =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const data = await getCalls({ token, accountId }) || {};
    let { calls } = data;
    dispatch(setCalls({ payload: { calls } }));
  }

export const acceptCall = () =>
  async (dispatch, getState) => {
    dispatch(setIsCallInProgress({ payload: { isCallInProgress: true } }));
    TwilioVoice.accept();
  }

export const rejectCall = () =>
  async (dispatch, getState) => {
    dispatch(setIsCallInProgress({ payload: { isCallInProgress: false } }));
    TwilioVoice.reject()
  }

export const connectCall = (activePhoneNumber) =>
  async (dispatch, getState) => {
    const { accountId } = getState().default;
    dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
    dispatch(setIsCallInProgress({ payload: { isCallInProgress: true } }));
    TwilioVoice.connect({ To: activePhoneNumber, From: accountId });
  }

export const disconnectCall = () =>
  (dispatch, getState) => {
    const { accountId } = getState().default;
    // dispatch(setActivePhoneNumber({ payload: { activePhoneNumber: '' } }));
    dispatch(setIsCallInProgress({ payload: { isCallInProgress: false } }));
    TwilioVoice.disconnect();
  }

export const joinActiveCall = () =>
  async (dispatch, getState) => {
    const { accountId } = getState().default;
    dispatch(setIsCallInProgress({ payload: { isCallInProgress: true } }));
    TwilioVoice.connect({ To: accountId, From: accountId });
  }

export const requestActivationToken = () =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const platform = Platform.OS;
    const data = await getActivationToken({ token, accountId, platform }) || {};
    let { activationToken } = data;
    dispatch(setActivationToken({ payload: { activationToken } }));
    await requestMicrophonePermission();
    registerTwilioVoiceEvents();
    const success = await TwilioVoice.initWithToken(activationToken);
    console.log(success);
    try {
      TwilioVoice.configureCallKit({
        appName: R.strings.TITLE_APP_NAME,
      });
    } catch (err) {
        console.err(err)
    }
  }

export const displayCallStatus = () =>
  (dispatch, getState) => {
    const { isAccountCallInProgress, isCallInProgress, activePhoneNumber } = getState().default;
    if (isAccountCallInProgress && !isCallInProgress) {
      showActiveCallMessage({ activePhoneNumber });
    } else {
      hideMessage();
    }
  }

export const initializeApplication = () =>
  async (dispatch) => {
    const userId = await AsyncStorage.getItem(Keys.USER_ID_KEY);
    const token = await AsyncStorage.getItem(Keys.TOKEN_KEY);
    const phoneNumber = await AsyncStorage.getItem(Keys.PHONE_NUMBER_KEY);
    const accountId = await AsyncStorage.getItem(Keys.ACCOUNT_ID_KEY);
    let isActive = await AsyncStorage.getItem(Keys.IS_ACTIVE_KEY);
    isActive = JSON.parse(isActive);
    dispatch(setUserId({ payload: { userId } }));
    dispatch(setToken({ payload: { token } }));
    dispatch(setPhoneNumber({ payload: { phoneNumber } }));
    dispatch(setAccountId({ payload: { accountId } }));
    dispatch(setIsActive({ payload: { isActive } }));
    dispatch(setIsInitialized());
    if (token) {
      dispatch(requestActivationToken());
      refreshToken();
    }
    if (isActive) {
      await checkActiveOrIncomingCalls();
    }
    await Facebook.initializeAsync({ appId: FACEBOOK_APP_ID });
    await Facebook.setAutoLogAppEventsEnabledAsync(true);
  };

export const logout = () =>
  (dispatch, getState) => {
    dispatch(storeAndSetUserId({ payload: { userId: '' } }));
    dispatch(storeAndSetToken({ payload: { token: '' } }));
    dispatch(storeAndSetActiveUser({ payload: { phoneNumber: '', accountId: '', isActive: false } }));
    TwilioVoice.unregister();
    closeSocket();
    analytics.reset();
  };

export const storeAndSetUserId = payload =>
  async (dispatch) => {
    const { userId } = payload.payload;
    AsyncStorage.setItem(Keys.USER_ID_KEY, userId);
    dispatch(setUserId({ payload: { userId } }));
  };

export const storeAndSetToken = payload =>
  async (dispatch) => {
    const { token } = payload.payload;
    AsyncStorage.setItem(Keys.TOKEN_KEY, token);
    dispatch(setToken({ payload: { token } }));
  };

export const storeAndSetPhoneNumber = payload =>
  async (dispatch) => {
    const { phoneNumber } = payload.payload;
    AsyncStorage.setItem(Keys.PHONE_NUMBER_KEY, phoneNumber);
    dispatch(setPhoneNumber({ payload: { phoneNumber } }));
  };

export const storeAndSetAccountId = payload =>
  async (dispatch) => {
    const { accountId } = payload.payload;
    AsyncStorage.setItem(Keys.ACCOUNT_ID_KEY, accountId);
    dispatch(setAccountId({ payload: { accountId } }));
  };

export const storeAndSetIsActive = payload =>
  async (dispatch) => {
    const { isActive } = payload.payload;
    AsyncStorage.setItem(Keys.IS_ACTIVE_KEY, JSON.stringify(isActive));
    dispatch(setIsActive({ payload: { isActive } }));
  };

export const storeAndSetActiveUser = payload =>
  async (dispatch) => {
    const { phoneNumber, isActive, accountId } = payload.payload;
    dispatch(storeAndSetPhoneNumber({ payload: { phoneNumber } }));
    dispatch(storeAndSetIsActive({ payload: { isActive } }));
    dispatch(storeAndSetAccountId({ payload: { accountId } }));
  };

export const setUserId = payload =>
  (dispatch) => {
    const { userId = '' } = payload.payload;
    if (userId) {
      analytics.identify(userId);
    }
    dispatch({
      type: UserTypes.SET_USER_ID,
      ...payload,
    });
  };

export const setToken = payload => ({
  type: UserTypes.SET_TOKEN,
  ...payload,
});

export const setPhoneNumber = payload => ({
  type: UserTypes.SET_PHONE_NUMBER,
  ...payload,
});

export const setAccountId = payload => ({
  type: UserTypes.SET_ACCOUNT_ID,
  ...payload,
});

export const setIsActive = payload => ({
  type: UserTypes.SET_IS_ACTIVE,
  ...payload,
});

export const setOwners = payload => ({
  type: OwnerTypes.SET_OWNERS,
  ...payload,
});

export const setMessages = payload => ({
  type: UserTypes.SET_MESSAGES,
  ...payload,
});

export const addMessage = payload => ({
  type: UserTypes.ADD_MESSAGE,
  ...payload,
});

export const setCalls = payload => ({
  type: UserTypes.SET_CALLS,
  ...payload,
});

export const setActivePhoneNumber = payload => ({
  type: CallTypes.SET_ACTIVE_PHONE_NUMBER,
  ...payload,
});

export const setCallState = payload => ({
  type: CallTypes.SET_CALL_STATE,
  ...payload,
});

export const setIsAccountCallInProgress = payload => ({
  type: CallTypes.SET_IS_ACCOUNT_CALL_IN_PROGRESS,
  ...payload,
});

export const setIsCallInProgress = payload => ({
  type: CallTypes.SET_IS_CALL_IN_PROGRESS,
  ...payload,
});

export const setActivationToken = payload => ({
  type: UserTypes.SET_ACTIVATION_TOKEN,
  ...payload,
});

export const setIsInitialized = () => ({
  type: AppTypes.SET_IS_INITIALIZED,
  payload: { isInitialized: true },
});

const actions = {
  setUserId,
  setToken,
};

export default actions;
