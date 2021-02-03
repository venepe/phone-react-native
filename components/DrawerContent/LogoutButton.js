import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  DrawerItem,
} from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';
import { clearSession } from '../../utilities/auth';
import R from '../../resources';

class LogoutButton extends Component {

  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  async onLogout() {
    await clearSession();
  }

  render() {
    return (
      <DrawerItem
        {...this.props}
        icon={({ color, size }) => (
          <AntDesign name="logout" color={R.colors.TEXT_MAIN} size={size} />
        )}
        label={R.strings.TITLE_LOGOUT}
        onPress={this.onLogout}
        />
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default LogoutButton;
