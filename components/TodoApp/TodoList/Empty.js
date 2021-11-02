import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
const SCREEN_HEIGHT = Dimensions.get('window').height - 200;
import R from '../../../resources';

class Empty extends Component {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigation.navigate('TodoStack', { screen: 'CreateTodo' });
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={this.onPress} style={styles.localContainer}>
            <MaterialIcons name="check" size={100} color={R.colors.TEXT_MAIN} />
            <Text style={styles.primaryText}>{R.strings.LABEL_TODO_LIST_EMPTY_PRIMARY}</Text>
            <Text style={styles.secondaryText}>{R.strings.LABEL_TODO_LIST_EMPTY_SECONDARY}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
    height: SCREEN_HEIGHT,
  },
  localContainer: {
    flex: 1,
    alignItems: 'center',
  },
  primaryText: {
    height: 32,
    fontSize: 24,
    color: R.colors.TEXT_MAIN,
    fontWeight: 'bold',
  },
  secondaryText: {
    height: 26,
    fontSize: 12,
    color: R.colors.TEXT_MAIN,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 'bold',
  },
});

export default Empty;
