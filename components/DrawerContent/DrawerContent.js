import React, { Component } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import LogoutButton from './LogoutButton';
import { getFormattedNumber } from '../../utilities/phone';
import { manageSubscription } from '../../utilities/subscriptions';
import { copyPhoneNumber } from '../../utilities/copy';
import { getUserId, getPhoneNumber } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class DrawerContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      phoneNumber: props.phoneNumber,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.userId !== prevProps.userId) {
      this.setState({
        userId: props.userId,
      });
    }
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const { userId, phoneNumber } = this.state;
    return (
      <DrawerContentScrollView {...this.props}>
          <View style={styles.root}>
            <View style={styles.drawerContent}>
              <TouchableOpacity
                onLongPress={() => copyPhoneNumber()}
                onPress={() => navigation.navigate('Home')}>
                <Text style={styles.title}>{getFormattedNumber(phoneNumber)}</Text>
              </TouchableOpacity>
              <DrawerItem
                {...this.props}
                icon={({ color, size }) => (
                  <MaterialIcons name="people" color={R.colors.TEXT_MAIN} size={size} />
                )}
                label={R.strings.TITLE_MEMBERS}
                onPress={() => navigation.navigate('Members')}
                />
              <DrawerItem
                {...this.props}
                icon={({ color, size }) => (
                  <MaterialIcons name="person-add" color={R.colors.TEXT_MAIN} size={size} />
                )}
                label={R.strings.TITLE_SHARE_CODE}
                onPress={() => navigation.navigate('ShareCode')}
                />
              <DrawerItem
                {...this.props}
                icon={({ color, size }) => (
                  <MaterialIcons name="settings" color={R.colors.TEXT_MAIN} size={size} />
                )}
                label={R.strings.TITLE_MANAGE_SUBSCRIPTION}
                onPress={() => manageSubscription()}
                />
              <LogoutButton {...this.props}/>
            </View>
          </View>
      </DrawerContentScrollView>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    marginTop: 20,
    marginLeft: 20,
    fontWeight: 'bold',
    color: R.colors.TEXT_MAIN,
  },
});

const mapStateToProps = state => ({
  userId: getUserId(state),
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { },
)(DrawerContent);
