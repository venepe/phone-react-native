import { AsyncStorage } from 'react-native';
import * as Facebook from 'expo-facebook';
import Keys from '../constants/Keys';
import AppTypes from '../constants/AppTypes';
import UserTypes from '../constants/UserTypes';
import { getStore } from '../store';
import analytics from '../analytics';
import { refreshToken } from '../utilities/auth';
import { FACEBOOK_APP_ID } from '../config';
import R from '../resources';

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
    console.log('here');
    if (token) {
      refreshToken();
    }
    await Facebook.initializeAsync({ appId: FACEBOOK_APP_ID });
    await Facebook.setAutoLogAppEventsEnabledAsync(true);
  };

export const logout = () =>
  (dispatch, getState) => {
    dispatch(storeAndSetUserId({ payload: { userId: '' } }));
    dispatch(storeAndSetToken({ payload: { token: '' } }));
    dispatch(storeAndSetActiveUser({ payload: { phoneNumber: '', accountId: '', isActive: false } }));
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

export const setIsInitialized = () => ({
  type: AppTypes.SET_IS_INITIALIZED,
  payload: { isInitialized: true },
});

const actions = {
  setUserId,
  setToken,
};

export default actions;
