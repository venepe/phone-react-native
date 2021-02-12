import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { clearSession } from '../../utilities/auth';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class Landing extends Component {

  constructor(props) {
    super(props);

    this.onJoinLine = this.onJoinLine.bind(this);
    this.onCreateLine = this.onCreateLine.bind(this);
    this.onLogout = this.onLogout.bind(this);

    this.state = {
    };
  }

  componentDidMount() {
    analytics.track(EVENTS.VIEWED_LANDING_TWO);
  }

  onJoinLine() {
    this.props.navigation.navigate('EnterCode');
  }

  onCreateLine() {
    this.props.navigation.navigate('AvailableNumberList');
  }

  async onLogout() {
    await clearSession();
    this.props.navigation.navigate('Landing');
  }

  render() {

    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.topContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-end' }]}
              source={require('../../assets/together.png')}
            />
          </View>
          <Text style={styles.primaryText}>{R.strings.LABEL_LANDING_TWO}</Text>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-start' }]}
              source={require('../../assets/running.png')}
            />
          </View>
        </View>
        <View style={{flex: .25, flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.loginButtonContainer, { backgroundColor: '#B388FF' }]} onPress={this.onJoinLine}>
              <Text style={styles.loginText}>{R.strings.LABEL_JOIN_LINE}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButtonContainer} onPress={this.onCreateLine}>
              <Text style={styles.loginText}>{R.strings.LABEL_CREATE_LINE}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onLogout}>
              <Text style={styles.logoutText}>{R.strings.TITLE_LOGOUT}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#40C4FF',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 200,
    margin: 20,
  },
  primaryText: {
    fontSize: 24,
    color: R.colors.TEXT_DARK,
    fontWeight: 'bold',
    flexWrap:'wrap',
    alignSelf: 'center',
  },
  actionContainer: {
    flex: 1,
  },
  loginButtonContainer: {
    height: 100,
    flexDirection: 'row',
    backgroundColor: '#FFF59D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    height: 36,
    fontSize: 25,
    margin: 10,
    alignSelf: 'center',
    color: R.colors.TEXT_DARK,
  },
  logoutText: {
    fontSize: 14,
    margin: 5,
    alignSelf: 'center',
    color: R.colors.TEXT_MAIN,
  },
});

export default Landing;
