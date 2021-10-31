import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { connectCall } from '../../actions';
import R from '../../resources';

class CreateCallButton extends Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);

    this.state = {
      targetNumber: props.targetNumber,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.targetNumber !== prevProps.targetNumber) {
      this.setState({
        targetNumber: props.targetNumber,
      });
    }
  }

  onPress() {
    const { targetNumber } = this.state;
    this.props.connectCall(targetNumber);
    this.props.navigation.navigate('CallStates', {
      screen: 'ActiveCall',
      params: { },
    });
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={() => this.onPress()}>
        <MaterialIcons name='phone' size={28} color={R.colors.TEXT_MAIN} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    height: 26,
    fontSize: 18,
    color: R.colors.TEXT_MAIN,
  },
});

CreateCallButton.defaultProps = {
  onPress: () => {},
};

CreateCallButton.propTypes = {

}

const mapStateToProps = state => ({ });

export default connect(
  null,
  { connectCall },
)(CreateCallButton);
