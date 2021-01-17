import { AsyncStorage } from 'react-native';
import Keys from '../constants/Keys';
import UserTypes from '../constants/UserTypes';
import { getApolloClient } from '../apolloClient';
import { getStore } from '../store';
import analytics, { EVENTS } from '../analytics';
import R from '../resources';

export const initializeApplication = () =>
  async (dispatch) => {
    const userId = await AsyncStorage.getItem(Keys.USER_ID_KEY);
    const token = await AsyncStorage.getItem(Keys.TOKEN_KEY);
    dispatch(setUserId({ payload: { userId } }));
    dispatch(setToken({ payload: { token } }));
    dispatch(requestLocation());
    if (userId) {
      analytics.identify(userId);
    }
  };

export const logout = () =>
  (dispatch, getState) => {
    dispatch(storeAndSetUserId({ payload: { userId: '' } }));
    dispatch(storeAndSetToken({ payload: { token: '' } }));
    getApolloClient().resetStore();
    analytics.reset();
  };

export const storeUserIdAndToken = payload =>
  (dispatch) => {
    let { payload: { userId, token } } = payload;
    dispatch(storeAndSetUserId({ payload: { userId } }));
    dispatch(storeAndSetToken({ payload: { token } }));
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

const actions = {
  setUserId,
  setToken,
};

export default actions;
