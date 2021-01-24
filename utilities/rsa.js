import { AsyncStorage } from 'react-native';
import { RSAKeychain } from 'react-native-rsa-native';
import Keys from '../constants/Keys';
import { postPublicKey } from '../fetches';

export const init = async () => {
  const keys = await RSAKeychain.generateKeys(Keys.PRIVATE_KEY_KEY, 2048);
  let { public: publicKey} = keys;
  const token = await AsyncStorage.getItem(Keys.TOKEN_KEY);
  postPublicKey({ token, publicKey });
  return publicKey;
}

export const getSignature = async (message) => {
  let signature = await RSAKeychain.sign(message, Keys.PRIVATE_KEY_KEY);
  return signature;
}

export const deletePrivateKey = async () => {
  RSAKeychain.deletePrivateKey(Keys.PRIVATE_KEY_KEY);
}
