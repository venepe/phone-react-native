import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

class OwnerListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rowID: props.rowID,
      ownerItem: props.ownerItem,
      selectedUserId: props.selectedUserId,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.ownerItem !== prevProps.ownerItem) {
      this.setState({
        ownerItem: props.ownerItem,
      });
    }
    if (props.selectedUserId !== prevProps.selectedUserId) {
      this.setState({
        selectedUserId: props.selectedUserId,
      });
    }
  }

  render() {
    const { ownerItem, selectedUserId } = this.state;
    let { userId, name } = ownerItem;
    const statusColor = selectedUserId === userId ? '#00E676' : '#9E9E9E';
    return (
      <TouchableOpacity
        onPress={() => this.props.onUpdateSelectedUserId(ownerItem)}
        style={[styles.buttonContainer, { backgroundColor: statusColor }]}
        >
        <Text style={styles.buttonText}>{name}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#00E676',
    borderRadius: 18,
    margin: 5,
  },
  buttonText: {
    padding: 8,
    fontSize: 15,
    color: '#FAFAFA',
  },
});

OwnerListItem.defaultProps = {
  selectedUserId: '',
  onUpdateSelectedUserId: () => {},
};

export default OwnerListItem;
