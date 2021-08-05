import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import reducers from '../reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['messages', 'calls'],
};

const rootReducer = combineReducers({
  default: persistReducer(persistConfig, reducers),
});

export default function configureStore () {
	return createStore(
		rootReducer,
		applyMiddleware(thunk),
	)
}
