import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import R from '../../resources';

class ContactListItem extends Component {
  static propTypes = {
    rowID: PropTypes.number,
  }

  static defaultProps = {
    rowID: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      rowID: props.rowID,
      contactItem: props.contactItem,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.contactItem !== prevProps.contactItem) {
      this.setState({
        contactItem: props.contactItem,
      });
    }
  }

  render() {
    const { contactItem } = this.state;
    return (
        <TouchableOpacity style={styles.root} onPress={() => this.props.onPress(contactItem)}>
          <View style={styles.nameContainer}>
            <Text style={styles.fullNameText}>{contactItem.fullName}</Text>
          </View>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: R.colors.BACKGROUND_MAIN,
    shadowColor: R.colors.TEXT_MAIN,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  nameContainer: {
    flex: 1,
  },
  fullNameText: {
    flex: 1,
    height: 28,
    fontSize: 22,
    color: R.colors.TEXT_MAIN,
  },
});

export default ContactListItem;
