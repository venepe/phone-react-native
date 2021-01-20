import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { connect } from 'react-redux';
import { initializeApplication } from '../../actions';

import Blank from '../Blank';
import Home from '../Home';
import AvailableNumberList from '../AvailableNumberList';
import DrawerContent from '../DrawerContent';
import Landing from '../Landing';
import R from '../../resources';

const HomeStack = createStackNavigator();
const RootStack = createStackNavigator();
const HomeTab = createMaterialTopTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName='HomeTabs'
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

function HomeTabs() {
  return (
    <HomeTab.Navigator>
      <HomeTab.Screen name="Home" component={Home} />
      <HomeTab.Screen name="Settings" component={Home} />
    </HomeTab.Navigator>
  );
}

const DrawerStack = createDrawerNavigator();

function DrawerStackScreen() {
  return (
    <DrawerStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: R.colors.HEADER_MAIN,
        },
        headerTintColor: R.colors.TEXT_MAIN,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      drawerStyle={{
        flex: 1,
        backgroundColor: R.colors.CONTENT_BACKGROUND,
      }}
      drawerContentOptions={{
        itemStyle: {
          color: R.colors.TEXT_MAIN,
        },
        labelStyle: {
          color: R.colors.TEXT_MAIN,
        },
        activeTintColor: R.colors.TEXT_MAIN,
      }}
      drawerPosition={'left'}
      drawerContent={(props) => (<DrawerContent {...props} />)}
      >
      <DrawerStack.Screen
        name="Home"
        component={Landing}
        options={({ route, navigation }) => ({
          title: 'R.strings.TITLE_HOME',
        })}
      />
    </DrawerStack.Navigator>
  );
}

class App extends Component {

  componentDidMount() {
    this.props.initializeApplication();
  }

  render() {
    return (
      <NavigationContainer>
        <RootStack.Navigator useanimationEnabled={false}>
          <RootStack.Screen name="Bubblepop" component={DrawerStackScreen} options={() => ({ headerShown: false })} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect(
  null,
  { initializeApplication },
)(App);
