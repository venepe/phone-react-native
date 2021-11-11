import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import OwnerListItem from './OwnerListItem';
import { requestOwners } from '../../actions';
import { getOwners, getUserId } from '../../reducers';
import { connect } from 'react-redux';

class OwnerList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);

    this.state = {
      owners: props.owners || [],
      userId: props.userId,
      selectedUserId: props.selectedUserId,
    };
  }

  componentDidMount() {
    this.props.requestOwners();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.owners !== prevProps.owners) {
      this.setState({
        owners: props.owners,
      });
    }
    if (props.selectedUserId !== prevProps.selectedUserId) {
      this.setState({
        selectedUserId: props.selectedUserId,
      });
    }
    if (props.userId !== prevProps.userId) {
      this.setState({
        userId: props.userId,
      });
    }
  }

  renderItem({ item, index }) {
    const { selectedUserId } = this.state;
    return (
      <OwnerListItem ownerItem={item} key={index} rowID={index} selectedUserId={selectedUserId} onUpdateSelectedUserId={(ownerItem) => this.props.onUpdateSelectedUserId(ownerItem)} />
    )
  }

  render() {
    const { isFetching, owners, userId } = this.state;
    let me = {};
    let _owners = owners.filter((owner) => {
      if (owner.userId === userId) {
        me = owner;
      }
      return owner.userId !== userId;
    });
    me.name = 'Me';
    _owners.unshift(me);
    return (
      <View style={styles.root}>
        <FlatList
          data={_owners}
          keyExtractor={(owner) => owner.sid}
          horizontal={true}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

OwnerList.defaultProps = {
  selectedUserId: '',
  onUpdateSelectedUserId: () => {},
};

const styles = StyleSheet.create({
  root: {
    height: 40,
    margin: 5,
  },
});

const mapStateToProps = state => ({
  owners: getOwners(state),
  userId: getUserId(state),
});

export default connect(
  mapStateToProps,
  { requestOwners },
)(OwnerList);
