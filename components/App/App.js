import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { initializeApplication } from '../../actions';

import Blank from '../Blank';
import AvailableNumberList from '../AvailableNumberList';
import Landing from '../Landing';
import R from '../../resources';

const HomeStack = createStackNavigator();
const RootStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName='AvailableNumberList'
      screenOptions={{
        headerStyle: {
          backgroundColor: R.colors.HEADER_MAIN,
        },
        headerTintColor: R.colors.TEXT_MAIN,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <HomeStack.Screen
          name='AvailableNumberList'
          component={AvailableNumberList}
        />
      <HomeStack.Screen
          name='Landing'
          component={Landing}
        />
    </HomeStack.Navigator>
  );
};

class App extends Component {

  componentDidMount() {
    this.props.initializeApplication();
  }

  render() {
    return (
      <NavigationContainer>
        <RootStack.Navigator useanimationEnabled={false}>
          <RootStack.Screen name="Bubblepop" component={HomeStackScreen} options={() => ({ headerShown: false })} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect(
  null,
  { initializeApplication },
)(App);
