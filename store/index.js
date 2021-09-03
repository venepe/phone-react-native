import { persistStore } from 'redux-persist';
import configureStore from './configureStore';

let store;
let persistor;

export function initStore() {
	store =  configureStore();
	persistor = persistStore(store);
  return { store, persistor };
}

export function getStore() {
  return store;
}

export default {};
