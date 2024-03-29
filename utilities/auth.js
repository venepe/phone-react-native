import { AsyncStorage } from 'react-native';
import Auth0 from 'react-native-auth0';
import { Base64 } from 'js-base64';
import Keys from '../constants/Keys';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } from '../config';
import { storeAndSetToken, storeAndSetUserId, logout  } from '../actions';
import { postUser, postUserLogout  } from '../fetches';
import { getStore } from '../store';

export const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem(Keys.REFRESH_TOKEN_KEY);
  const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

  return auth0
  .auth
  .refreshToken({ refreshToken, scope: 'openid profile email offline_access' })
  .then((credentials) => {
    const { accessToken: token } = credentials;
    getStore().dispatch(storeAndSetToken({ payload: { token } }));
    return credentials;
  })
  .catch(e => {
    console.log(e);
  });
}

export const login = async () => {
  const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

  const credentials = await auth0.webAuth.authorize({
    scope: 'openid profile email offline_access',
    audience: AUTH0_AUDIENCE,
  });

  if (__DEV__) {
    console.log(credentials);
  }

  const { accessToken: token, refreshToken, idToken } = credentials;
  let payload = idToken.split('.')[1];
  let { sub: userId } = JSON.parse(Base64.decode(payload));

  AsyncStorage.setItem(Keys.REFRESH_TOKEN_KEY, refreshToken);
  getStore().dispatch(storeAndSetToken({ payload: { token } }));
  getStore().dispatch(storeAndSetUserId({ payload: { userId } }));
  await postUser({ token });

  return credentials;
}

export const clearSession = async () => {
  const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });
  const token = getStore().getState().default.token;

  return auth0
  .webAuth
  .clearSession()
  .then(() => {
    postUserLogout({ token });
    getStore().dispatch(logout());
  });
}
