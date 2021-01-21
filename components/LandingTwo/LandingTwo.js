import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import R from '../../resources';

class Landing extends Component {

  constructor(props) {
    super(props);

    this.onJoinLine = this.onJoinLine.bind(this);
    this.onCreateLine = this.onCreateLine.bind(this);

    this.state = {
    };
  }

  onJoinLine() {
    this.props.navigation.navigate('LandingTwo');
  }

  onCreateLine() {
    this.props.navigation.navigate('AvailableNumberList');
  }

  render() {

    return (
      <View style={styles.root}>
        <View style={styles.iconContainer}>
          <View style={styles.subContainer}>
            <Text style={styles.primaryText}>{R.strings.LABEL_APP_SLOGAN}</Text>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.loginButtonContainer, { backgroundColor: '#F50057' }]} onPress={this.onJoinLine}>
              <Text style={styles.loginText}>{R.strings.LABEL_JOIN_LINE}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButtonContainer} onPress={this.onCreateLine}>
              <Text style={styles.loginText}>{R.strings.LABEL_CREATE_LINE}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#18ffff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  emojiText: {
    height: 120,
    fontSize: 92,
  },
  primaryText: {
    height: 32,
    fontSize: 24,
    color: '#424242',
    fontWeight: 'bold',
  },
  secondaryText: {
    height: 26,
    fontSize: 12,
    color: '#424242',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  actionContainer: {
    flex: 1,
  },
  loginButtonContainer: {
    flex: .25,
    flexDirection: 'row',
    backgroundColor: '#FFFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    height: 36,
    fontSize: 25,
    margin: 10,
    alignSelf: 'center',
    color: '#424242',
  },
});

export default Landing;
