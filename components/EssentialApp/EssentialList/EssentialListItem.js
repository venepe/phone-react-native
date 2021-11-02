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
import R from '../../../resources';

class EssentialListItem extends Component {
  constructor(props) {
    super(props);
    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      rowID: props.rowID,
      essentialListItem: props.essentialListItem,
      isCompleted: false,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.essentialListItem !== prevProps.essentialListItem) {
      this.setState({
        essentialListItem: props.essentialListItem,
      });
    }
  }

  onPressRow(essentialListItem) {
    const { name } = essentialListItem;
    this.setState({
      isCompleted: true,
    });
    setTimeout(() => {this.props.onPressRow(essentialListItem)}, 1000);
  }

  render() {
    const { navigation } = this.props;
    const { isCompleted } = this.state;
    const essentialListItem = this.state.essentialListItem || {};
    let { name, createdAt } = essentialListItem;
    const iconName = isCompleted ? 'radio-button-on' : 'radio-button-off';
    const right = [
      { text: R.strings.LABEL_DELETE, color: R.colors.TEXT_MAIN, backgroundColor: R.colors.RED, onPress: () => this.props.onDelete(essentialListItem) },
    ];
    return (
      <Swipeout right={right} autoClose>
        <TouchableOpacity style={[styles.card, styles.container]} onPress={() => this.onPressRow(essentialListItem)}>
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

EssentialListItem.defaultProps = {
  onPressRow: () => {},
};

export default connect(
  null,
  { },
)(EssentialListItem);
