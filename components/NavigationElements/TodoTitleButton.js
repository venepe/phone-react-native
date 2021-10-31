import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { getSelectedTodoTitle } from '../../reducers/todo';
import R from '../../resources';

class TodoTitleButton extends Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.state = {
      selectedTodoTitle: props.selectedTodoTitle,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.selectedTodoTitle !== prevProps.selectedTodoTitle) {
      this.setState({
        selectedTodoTitle: props.selectedTodoTitle,
      });
    }
  }

  onPress() {
    this.props.navigation.navigate('ModalStack', {
      screen: 'UpdateTodoTitle',
    });
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <Text style={styles.text}>{this.state.selectedTodoTitle}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    height: 26,
    fontSize: 18,
    color: '#FFFFFF',
  },
});

TodoListTitleButton.defaultProps = {
  onPress: () => {},
};

TodoListTitleButton.propTypes = {

}

const mapStateToProps = state => ({
  selectedTodoTitle: getSelectedTodoTitle(state),
});

export default connect(
  mapStateToProps,
  { },
)(TodoListTitleButton);
