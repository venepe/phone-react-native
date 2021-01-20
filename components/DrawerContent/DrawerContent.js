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
import { getUserId, getPhoneNumber } from '../../reducers';
import { Feather } from '@expo/vector-icons';
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
              <TouchableOpacity onPress={() => navigation.navigate('UpdateName')}>
                <Text style={styles.title}>{phoneNumber}</Text>
              </TouchableOpacity>
              <DrawerItem
                {...this.props}
                icon={({ color, size }) => (
                  <Feather name="award" color={R.colors.TEXT_MAIN} size={size} />
                )}
                label={'points'}
                onPress={this.forceRefresh}
                />
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
