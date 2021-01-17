import React from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { enableExperimentalFragmentVariables } from 'graphql-tag';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { ApolloProvider } from 'react-apollo';
import FlashMessage from 'react-native-flash-message';
import client from './apolloClient';
import AppApp from './components/App';
import { initStore } from './store';
enableScreens();
enableExperimentalFragmentVariables()

const store = initStore();

export default class Base extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <View style={{ flex: 1 }}>
            <AppApp />
            <FlashMessage position='top' animated={true}/>
          </View>
        </ApolloProvider>
      </Provider>
  );
  }
}
