import React, { Component } from 'react';
import { AppState } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { connect } from 'react-redux';
import { initializeApplication } from '../../actions';
import { getIsLoggedIn, getIsActiveUser } from '../../reducers';

import Blank from '../Blank';
import Home from '../Home';
import ChatList from '../ChatList';
import AvailableNumberList from '../AvailableNumberList';
import DrawerContent from '../DrawerContent';
import SimpleDrawer from '../DrawerContent/SimpleDrawer';
import Landing from '../Landing';
import LandingTwo from '../LandingTwo';
import EnterCode from '../EnterCode';
import MemberList from '../MemberList';
import ShareCode from '../ShareCode';
import Manage from '../Manage';
import R from '../../resources';

const LandingStack = createStackNavigator();
const ProposeStack = createDrawerNavigator();
const RootStack = createStackNavigator();
const HomeTab = createMaterialTopTabNavigator();
const HomeStack = createDrawerNavigator();

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
        options={() => ({
          title: R.strings.TITLE_AVAILABLE_NUMBER,
        })}
      />
      <LandingStack.Screen
        name='Landing'
        component={Landing}
        options={() => ({
          title: R.strings.TITLE_LANDING,
          headerShown: false,
        })}
      />
      <LandingStack.Screen
        name='LandingTwo'
        component={LandingTwo}
        options={() => ({
          title: R.strings.TITLE_LANDING_TWO,
          headerShown: false,
        })}
      />
      <LandingStack.Screen
        name='EnterCode'
        component={EnterCode}
        options={() => ({
          title: R.strings.TITLE_ENTER_CODE,
        })}
      />
    </LandingStack.Navigator>
  );
};

function ProposeStackScreen() {
  return (
    <ProposeStack.Navigator
      initialRouteName="ProposeStack"
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
      drawerContent={(props) => (<SimpleDrawer {...props} />)}
      >
      <ProposeStack.Screen
        name="ShareCode"
        component={ShareCode}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_SHARE_CODE,
        })}
      />
      <ProposeStack.Screen
        name="Manage"
        component={Manage}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_MANAGE,
        })}
      />
    </ProposeStack.Navigator>
  );
};

function HomeTabs() {
  return (
    <HomeTab.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: R.colors.BACKGROUND_DARK,
        },
        indicatorStyle: {
          backgroundColor: R.colors.TEXT_MAIN,
        },
        labelStyle: {
          color: R.colors.TEXT_MAIN,
        }
      }}
    >
      <HomeTab.Screen name={R.strings.TITLE_CHATS} component={ChatList} />
    </HomeTab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
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
      <HomeStack.Screen
        name="Home"
        component={HomeTabs}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_APP_NAME,
        })}
      />
      <HomeStack.Screen
        name="Members"
        component={MemberList}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_MEMBERS,
        })}
      />
      <HomeStack.Screen
        name="Manage"
        component={Manage}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_MANAGE,
        })}
      />
    </HomeStack.Navigator>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.renderAuthenticated = this.renderAuthenticated.bind(this);
    this.renderUnauthenticated = this.renderUnauthenticated.bind(this);
    this.renderProposal = this.renderProposal.bind(this);
    this.state = {
      isLoggedIn: props.isLoggedIn,
      isActiveUser: props.isActiveUser,
      appState: AppState.currentState
    }
  }

  componentDidMount() {
    this.props.initializeApplication();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.isLoggedIn !== prevProps.isLoggedIn) {
      this.setState({
        isLoggedIn: props.isLoggedIn,
      });
    }
    if (props.isActiveUser !== prevProps.isActiveUser) {
      this.setState({
        isActiveUser: props.isActiveUser,
      });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

    }
    this.setState({ appState: nextAppState });
  }

  renderAuthenticated() {
    return (
      <>
        <RootStack.Screen name="Bubblepop" component={HomeStackScreen} options={() => ({ headerShown: false })} />
      </>
    );
  }

  renderProposal() {
    return (
      <>
        <RootStack.Screen name="Propose" component={ProposeStackScreen} options={() => ({ headerShown: false })} />
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
    const { isLoggedIn, isActiveUser } = this.state;
    const screens = isActiveUser ? this.renderAuthenticated() : isLoggedIn ? this.renderProposal() : this.renderUnauthenticated();
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
  isActiveUser: getIsActiveUser(state),
});

export default connect(
  mapStateToProps,
  { initializeApplication },
)(App);
