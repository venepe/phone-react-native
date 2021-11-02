import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import reducers from '../reducers';
import todoAppReducer from '../reducers/todo';
import essentialAppReducer from '../reducers/essential';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['messages', 'calls'],
};

const rootReducer = combineReducers({
  default: persistReducer(persistConfig, reducers),
  todoApp: persistReducer(persistConfig, todoAppReducer),
  essentialApp: persistReducer(persistConfig, essentialAppReducer),
});

export default function configureStore () {
	return createStore(
		rootReducer,
		applyMiddleware(thunk),
	)
}
