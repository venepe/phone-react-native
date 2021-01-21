import { AsyncStorage } from 'react-native';
import Auth0 from 'react-native-auth0';
import Keys from '../constants/Keys';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } from '../config';
import { storeAndSetToken } from '../actions';
import { getStore } from '../store';

export const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem(Keys.REFRESH_TOKEN_KEY);
  const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

  return auth0
  .webAuth
  .refreshToken({ refreshToken, scope: 'openid profile email, offline_access' })
  .then((credentials) => {
    const { accessToken: token, refreshToken } = credentials;
    AsyncStorage.setItem(Keys.REFRESH_TOKEN_KEY, refreshToken);
    getStore().dispatch(storeAndSetToken({ payload: { token } }));
    return credentials;
  });
}

export const login = async () => {
  const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

  return auth0
  .webAuth
  .authorize({ scope: 'openid profile email, offline_access', audience: AUTH0_AUDIENCE })
  .then((credentials) => {
    const { accessToken: token, refreshToken } = credentials;
    AsyncStorage.setItem(Keys.REFRESH_TOKEN_KEY, refreshToken);
    getStore().dispatch(storeAndSetToken({ payload: { token } }));
    return credentials;
  });
}

export const logout = async () => {
  const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

  return auth0
  .webAuth
  .clearSession();
}
