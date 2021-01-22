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
import parsePhoneNumber from 'libphonenumber-js';
import { connect } from 'react-redux';
import LogoutButton from './LogoutButton';
import { getUserId, getPhoneNumber } from '../../reducers';
import { MaterialIcons } from '@expo/vector-icons';
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
    const { userId, phoneNumber = '' } = this.state;
    const formatter = parsePhoneNumber(phoneNumber);
    let phoneNumberText = '';
    if (formatter) {
      phoneNumberText = formatter.formatNational();
    }
    return (
      <DrawerContentScrollView {...this.props}>
          <View style={styles.root}>
            <View style={styles.drawerContent}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.title}>{phoneNumberText}</Text>
              </TouchableOpacity>
              <DrawerItem
                {...this.props}
                icon={({ color, size }) => (
                  <MaterialIcons name="people" color={R.colors.TEXT_MAIN} size={size} />
                )}
                label={'Us'}
                onPress={() => navigation.navigate('Members')}
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
