import React, { Component } from 'react';
import { AppState } from 'react-native';
import branch from 'react-native-branch';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { navigationRef } from './RootNavigation';
import { initializeApplication, requestCalls, requestMessages, requestActivationToken } from '../../actions';
import { getIsLoggedIn, getIsActiveUser, getIsInitialized } from '../../reducers';
import { initializeNotifications } from '../../utilities/notification';
import { getReadableNumber } from '../../utilities/phone';
import { checkActiveOrIncomingCalls } from '../../utilities/twilio-voice';

import Blank from '../Blank';
import Home from '../Home';
import Account from '../Account';
import Blog from '../Blog';
import Horoscope from '../Horoscope';
import CallList from '../CallList';
import ChatList from '../ChatList';
import ChatDetail from '../ChatDetail';
import CreateCall from '../CreateCall';
import CreateChat from '../CreateChat';
import DialPad from '../DialPad';
import AvailableNumberList from '../AvailableNumberList';
import Landing from '../Landing';
import EnterCode from '../EnterCode';
import JoinCode from '../JoinCode';
import MemberList from '../MemberList';
import ShareCode from '../ShareCode';
import ShareInvite from '../ShareInvite';
import ShareQRCode from '../ShareQRCode';
import UpdateBirthdate from '../UpdateBirthdate';
import UpdateName from '../UpdateName';
import TodoList from '../TodoApp/TodoList';
import CreateTodo from '../TodoApp/CreateTodo';
import EssentialList from '../EssentialApp/EssentialList';
import CreateEssential from '../EssentialApp/CreateEssential';
import Manage from '../Manage';
import ActiveCall from '../CallScreens/ActiveCall';
import IncomingCall from '../CallScreens/IncomingCall';
import CreateCallButton from '../NavigationElements/CreateCallButton';
import R from '../../resources';

const LandingStack = createStackNavigator();
const JoinStack = createStackNavigator();
const RootStack = createStackNavigator();
const HomeTab = createMaterialTopTabNavigator();
const HomeStack = createStackNavigator();
const CallDetailStack = createStackNavigator();
const ChatDetailStack = createStackNavigator();
const QRCodeStack = createStackNavigator();
const CallStateStack = createStackNavigator();
const ListTab = createMaterialTopTabNavigator();
const ListStack = createStackNavigator();
const TodoStack = createStackNavigator();
const EssentialStack = createStackNavigator();
const MainTab = createBottomTabNavigator();
const AccountStack = createStackNavigator();

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
          title: R.strings.TITLE_CREATE_NUMBER,
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
        name='EnterCode'
        component={EnterCode}
        options={() => ({
          title: R.strings.TITLE_ENTER_CODE,
        })}
      />
    </LandingStack.Navigator>
  );
};

function JoinStackScreen() {
  return (
    <JoinStack.Navigator initialRouteName='JoinCode'
      screenOptions={{
        headerShown: false,
      }}
    >
      <JoinStack.Screen
        name='JoinCode'
        component={JoinCode}
        options={() => ({
          title: R.strings.TITLE_ENTER_CODE,
        })}
      />
    </JoinStack.Navigator>
  );
};

function QRCodeStackScreen() {
  return (
    <QRCodeStack.Navigator initialRouteName='ShareQRCode'
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
      <QRCodeStack.Screen
        name='ShareQRCode'
        component={ShareQRCode}
        options={() => ({
          title: R.strings.TITLE_ENTER_CODE,
        })}
      />
    </QRCodeStack.Navigator>
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
      <HomeTab.Screen name={R.strings.TITLE_CALLS} component={CallList} />
    </HomeTab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName='Home'
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
      >
      <HomeStack.Screen
        name='Home'
        component={HomeTabs}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_PHONE_TAB,
        })}
      />
    </HomeStack.Navigator>
  );
}

function AccountStackScreen() {
  return (
    <AccountStack.Navigator
      initialRouteName='Account'
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
      >
      <AccountStack.Screen
        name='Account'
        component={Account}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_MORE_TAB,
        })}
      />
      <AccountStack.Screen
        name='Blog'
        component={Blog}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_BLOG,
        })}
      />
      <AccountStack.Screen
        name='Horoscope'
        component={Horoscope}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_HOROSCOPE,
        })}
      />
      <AccountStack.Screen
        name='Me'
        component={UpdateName}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_ME,
        })}
      />
      <AccountStack.Screen
        name='Birthdate'
        component={UpdateBirthdate}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_ME,
        })}
      />
      <AccountStack.Screen
        name='Members'
        component={MemberList}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_MEMBERS,
        })}
      />
      <AccountStack.Screen
        name='Manage'
        component={Manage}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_MANAGE,
        })}
      />
      <AccountStack.Screen
        name='ShareInvite'
        component={ShareInvite}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_INVITE,
        })}
      />
      <QRCodeStack.Screen
        name='ShareQRCode'
        component={ShareQRCode}
        options={() => ({
          title: R.strings.TITLE_ENTER_CODE,
        })}
      />
    </AccountStack.Navigator>
  );
}

function ChatDetailStackScreen() {
  return (
    <ChatDetailStack.Navigator initialRouteName='ChatDetail'
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
      <ChatDetailStack.Screen
        name='ChatDetail'
        component={ChatDetail}
        options={({ route, navigation }) => ({
          title: route.params.title,
          headerBackTitle: R.strings.LABEL_BACK,
          headerRight: () => (<CreateCallButton navigation={navigation} targetNumber={route.params.targetNumber}/>),
        })}
      />
      <ChatDetailStack.Screen
        name='CreateChat'
        component={CreateChat}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_CREATE_CHAT,
        })}
      />
    </ChatDetailStack.Navigator>
  );
};

function CallDetailStackScreen() {
  return (
    <CallDetailStack.Navigator initialRouteName='DialPad'
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
      <CallDetailStack.Screen
        name='CreateCall'
        component={CreateCall}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_CONTACTS,
        })}
      />
      <CallDetailStack.Screen
        name='DialPad'
        component={DialPad}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_CREATE_CALL,
        })}
      />
    </CallDetailStack.Navigator>
  );
};

function CallStateStackScreen() {
  return (
    <CallStateStack.Navigator initialRouteName='ActiveCall'
      screenOptions={{
        headerShown: false,
      }}
    >
      <CallStateStack.Screen
        name='ActiveCall'
        component={ActiveCall}
      />
      <CallStateStack.Screen
        name='IncomingCall'
        component={IncomingCall}
      />
    </CallStateStack.Navigator>
  );
};

function ListStackScreen() {
  return (
    <ListStack.Navigator
      initialRouteName='List'
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
      >
      <ListStack.Screen
        name='List'
        component={ListTabs}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_LIST_TAB,
        })}
      />
    </ListStack.Navigator>
  );
}

function ListTabs() {
  return (
    <ListTab.Navigator
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
      <ListTab.Screen name={R.strings.TITLE_ESSENTIAL_LIST} component={EssentialStackScreen} />
      <ListTab.Screen name={R.strings.TITLE_TODO_LIST} component={TodoStackScreen} />
    </ListTab.Navigator>
  );
}

function EssentialStackScreen() {
  return (
    <EssentialStack.Navigator
      initialRouteName='EssentialList'
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: R.colors.HEADER_MAIN,
        },
        headerTintColor: R.colors.TEXT_MAIN,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
      <EssentialStack.Screen
        name='EssentialList'
        component={EssentialList}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_LIST_TAB,
        })}
      />
      <EssentialStack.Screen
        name="CreateEssential"
        component={CreateEssential}
        options={({ route, navigation }) => ({
          headerShown: true,
          headerBackTitle: R.strings.LABEL_CANCEL,
          title: R.strings.TITLE_CREATE_ESSENTIAL,
        })}
      />
    </EssentialStack.Navigator>
  );
};

function TodoStackScreen() {
  return (
    <TodoStack.Navigator
      initialRouteName='TodoList'
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: R.colors.HEADER_MAIN,
        },
        headerTintColor: R.colors.TEXT_MAIN,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
      <TodoStack.Screen
        name='TodoList'
        component={TodoList}
        options={({ route, navigation }) => ({
          title: R.strings.TITLE_LIST_TAB,
        })}
      />
      <TodoStack.Screen
        name="CreateTodo"
        component={CreateTodo}
        options={({ route, navigation }) => ({
          headerShown: true,
          headerBackTitle: R.strings.LABEL_CANCEL,
          title: R.strings.TITLE_CREATE_TODO,
        })}
      />
    </TodoStack.Navigator>
  );
};

function MainTabScreen() {
  return (
    <MainTab.Navigator
        tabBarOptions={{
          activeTintColor: R.colors.LOGO,
          inactiveTintColor: R.colors.TAB_BAR_INACTIVE,
          style: {
            backgroundColor: R.colors.HEADER_MAIN,
          },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === R.strings.TITLE_PHONE_TAB) {
              iconName = focused
                ? 'phone'
                : 'phone-outline';
            } else if (route.name === R.strings.TITLE_LIST_TAB) {
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
            } else if (route.name === R.strings.TITLE_MORE_TAB) {
              iconName = focused ? 'account-circle' : 'account-circle-outline';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <MainTab.Screen name={R.strings.TITLE_PHONE_TAB} component={HomeStackScreen} />
        <MainTab.Screen name={R.strings.TITLE_LIST_TAB} component={ListStackScreen} />
        <MainTab.Screen name={R.strings.TITLE_MORE_TAB} component={AccountStackScreen} />
      </MainTab.Navigator>
  );
};

const linking = {
  prefixes: ['https://anumberforus.com', 'https://invite.anumberforus.com', 'anumberforus://'],
  config: {
    Join: {
      screens: {
        JoinCode: 'invitations/:invitation',
      }
    },
  },
  subscribe(listener) {
    branch.subscribe(({ error, params, uri }) => {
      console.log(params);
      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }
      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link'];
        // Route non-Branch URL if appropriate.
        return;
      }
      if (!params['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return;
      }
      // A Branch link was opened
      const url = params.$canonical_url;
      setTimeout(() => { listener(url); }, 100);
    });

    return () => {
      // Clean up the event listeners
      // if (branch) {
      //   branch.unsubscribe();
      // }
    };
  },
};

class App extends Component {

  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.renderAuthenticated = this.renderAuthenticated.bind(this);
    this.renderUnauthenticated = this.renderUnauthenticated.bind(this);
    this.renderInitializing = this.renderInitializing.bind(this);
    this.state = {
      isInitialized: props.isInitialized,
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
    if (props.isInitialized !== prevProps.isInitialized) {
      this.setState({
        isInitialized: props.isInitialized,
      });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  async handleAppStateChange(nextAppState) {
    const { appState, isActiveUser  } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isActiveUser) {
        checkActiveOrIncomingCalls();
        this.props.requestActivationToken();
        this.props.requestCalls();
        this.props.requestMessages();
      }
    }
    this.setState({ appState: nextAppState });
  }

  renderAuthenticated() {
    initializeNotifications();
    return (
      <>
        <RootStack.Screen name='MainTab' component={MainTabScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name='ANumberForUs' component={HomeStackScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name="Calls" component={CallDetailStackScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name="Messages" component={ChatDetailStackScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name='QRCode' component={QRCodeStackScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name='CallStates' component={CallStateStackScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name="TodoStack" component={TodoStackScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name="EssentialStack" component={EssentialStackScreen} options={() => ({ headerShown: false })} />
      </>
    );
  }

  renderUnauthenticated() {
    return (
      <>
        <RootStack.Screen name='Welcome' component={LandingStackScreen} options={() => ({ headerShown: false })} />
        <RootStack.Screen name='Join' component={JoinStackScreen} options={() => ({ headerShown: false })} />
      </>
    );
  }

  renderInitializing() {
    return (
      <>
        <RootStack.Screen name='Initialize' component={Blank} options={() => ({ headerShown: false })} />
      </>
    );
  }

  render() {
    const { isLoggedIn, isActiveUser, isInitialized } = this.state;
    const screens = !isInitialized ? this.renderInitializing() : isActiveUser ? this.renderAuthenticated() : this.renderUnauthenticated();
    return (
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
      >
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
  isInitialized: getIsInitialized(state),
});

export default connect(
  mapStateToProps,
  { initializeApplication, requestMessages, requestActivationToken, requestCalls },
)(App);
