import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { connect } from 'react-redux';
import { initializeApplication } from '../../actions';
import { getIsLoggedIn } from '../../reducers';

import Blank from '../Blank';
import Home from '../Home';
import ChatList from '../ChatList';
import ChatDetailList from '../ChatDetailList';
import PhoneCallList from '../PhoneCallList';
import AvailableNumberList from '../AvailableNumberList';
import DrawerContent from '../DrawerContent';
import Landing from '../Landing';
import LandingTwo from '../LandingTwo';
import R from '../../resources';

const HomeStack = createStackNavigator();
const LandingStack = createStackNavigator();
const RootStack = createStackNavigator();
const HomeTab = createMaterialTopTabNavigator();

function LandingStackScreen() {
  return (
    <LandingStack.Navigator initialRouteName='Landing'
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
      <LandingStack.Screen
          name='AvailableNumberList'
          component={AvailableNumberList}
        />
      <LandingStack.Screen
          name='Landing'
          component={Landing}
        />
      <LandingStack.Screen
          name='LandingTwo'
          component={LandingTwo}
        />
    </LandingStack.Navigator>
  );
};

function HomeTabs() {
  return (
    <HomeTab.Navigator>
      <HomeTab.Screen name={R.strings.TITLE_CHATS} component={ChatList} />
      <HomeTab.Screen name={R.strings.TITLE_CALLS} component={PhoneCallList} />
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
        component={HomeTabs}
        options={({ route, navigation }) => ({
          title: 'R.strings.TITLE_HOME',
        })}
      />
      <DrawerStack.Screen
        name="ChatDetailList"
        component={ChatDetailList}
        options={({ route, navigation }) => ({
          title: 'R.strings.TITLE_HOME',
        })}
      />
    </DrawerStack.Navigator>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.renderAuthenticated = this.renderAuthenticated.bind(this);
    this.renderUnauthenticated = this.renderUnauthenticated.bind(this);
    this.state = {
      isLoggedIn: props.isLoggedIn,
    }
  }

  componentDidMount() {
    this.props.initializeApplication();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.isLoggedIn !== prevProps.isLoggedIn) {
      this.setState({
        isLoggedIn: props.isLoggedIn,
      });
    }
  }

  renderAuthenticated() {
    return (
      <>
        <RootStack.Screen name="Bubblepop" component={DrawerStackScreen} options={() => ({ headerShown: false })} />
      </>
    );
  }

  renderUnauthenticated() {
    return (
      <>
        <RootStack.Screen name="Welcome" component={LandingStackScreen} options={() => ({ headerShown: false })} />
      </>
    );
  }

  render() {
    const { isLoggedIn } = this.state;
    const screens = isLoggedIn ? this.renderAuthenticated() : this.renderUnauthenticated();
    return (
      <NavigationContainer>
        <RootStack.Navigator useanimationEnabled={false}>
          {screens}
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: getIsLoggedIn(state),
});

export default connect(
  mapStateToProps,
  { initializeApplication },
)(App);
