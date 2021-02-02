import { AsyncStorage } from 'react-native';
import Keys from '../constants/Keys';
import UserTypes from '../constants/UserTypes';
import { getStore } from '../store';
import analytics, { EVENTS } from '../analytics';
import { refreshToken } from '../utilities/auth';
import { deletePrivateKey } from '../utilities/rsa';
import R from '../resources';

export const initializeApplication = () =>
  async (dispatch) => {
    const userId = await AsyncStorage.getItem(Keys.USER_ID_KEY);
    const token = await AsyncStorage.getItem(Keys.TOKEN_KEY);
    const phoneNumber = await AsyncStorage.getItem(Keys.PHONE_NUMBER_KEY);
    let isActive = await AsyncStorage.getItem(Keys.IS_ACTIVE_KEY);
    isActive = JSON.parse(isActive);
    dispatch(setUserId({ payload: { userId } }));
    dispatch(setToken({ payload: { token } }));
    dispatch(setPhoneNumber({ payload: { phoneNumber } }));
    dispatch(setIsActive({ payload: { isActive } }));
    if (userId) {
      analytics.identify(userId);
    }
    if (token) {
      refreshToken();
    }
  };

export const logout = () =>
  (dispatch, getState) => {
    dispatch(storeAndSetUserId({ payload: { userId: '' } }));
    dispatch(storeAndSetToken({ payload: { token: '' } }));
    dispatch(storeAndSetActiveUser({ payload: { phoneNumber: '', isActive: false } }));
    deletePrivateKey();
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

export const storeAndSetIsActive = payload =>
  async (dispatch) => {
    const { isActive } = payload.payload;
    AsyncStorage.setItem(Keys.IS_ACTIVE_KEY, JSON.stringify(isActive));
    dispatch(setIsActive({ payload: { isActive } }));
  };

export const storeAndSetActiveUser = payload =>
  async (dispatch) => {
    const { phoneNumber, isActive } = payload.payload;
    dispatch(storeAndSetPhoneNumber({ payload: { phoneNumber } }));
    dispatch(storeAndSetIsActive({ payload: { isActive } }));
  };

export const setUserId = payload =>
  (dispatch) => {
    const { userId = '' } = payload.payload;
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

export const setIsActive = payload => ({
  type: UserTypes.SET_IS_ACTIVE,
  ...payload,
});

const actions = {
  setUserId,
  setToken,
};

export default actions;
