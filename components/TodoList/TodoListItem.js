import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import { showCompleted } from '../../utilities/flash-message';
import R from '../../resources';

class TodoListItem extends Component {
  constructor(props) {
    super(props);
    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      rowID: props.rowID,
      todoListItem: props.todoListItem,
      isCompleted: false,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.todoListItem !== prevProps.todoListItem) {
      this.setState({
        todoListItem: props.todoListItem,
      });
    }
  }

  onPressRow(todoListItem) {
    const { name } = todoListItem;
    this.setState({
      isCompleted: true,
    });
    showCompleted();
    setTimeout(() => {this.props.onPressRow(todoListItem)}, 1000);
  }

  render() {
    const { navigation } = this.props;
    const { isCompleted } = this.state;
    const todoListItem = this.state.todoListItem || {};
    let { name, createdAt } = todoListItem;
    const iconName = isCompleted ? 'radio-button-on' : 'radio-button-off';
    const right = [
      { text: R.strings.LABEL_DELETE, color: R.colors.TEXT_MAIN, backgroundColor: R.colors.RED, onPress: () => this.props.onDelete(todoListItem) },
    ];
    return (
      <Swipeout right={right} autoClose>
        <TouchableOpacity style={[styles.card, styles.container]} onPress={() => this.onPressRow(todoListItem)}>
          <MaterialIcons name={iconName} size={30} color={R.colors.TEXT_MAIN} />
          <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    padding: 28,
    paddingLeft: 15,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: R.colors.BACKGROUND_MAIN,
    shadowColor: R.colors.TEXT_MAIN,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  name: {
    color: R.colors.TEXT_MAIN,
    fontSize: 28,
    fontWeight: '400',
    marginLeft: 10,
  },
});

TodoListItem.defaultProps = {
  onPressRow: () => {},
};

export default connect(
  null,
  { },
)(TodoListItem);
