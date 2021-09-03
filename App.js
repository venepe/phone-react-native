import React from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import AppApp from './components/App';
import { initStore } from './store';
enableScreens();

const { store, persistor } = initStore();

export default class Base extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={{ flex: 1 }}>
            <AppApp />
            <FlashMessage position='top' animated={true}/>
          </View>
        </PersistGate>
      </Provider>
  );
  }
}
