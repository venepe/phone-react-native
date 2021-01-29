import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Blank from '../Blank';
import MemberItem from './MemberItem';
import Empty from './Empty';
import { getOwners } from '../../fetches';
import { getToken, getPhoneNumber } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class MemberList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.state = {
      isFetching: false,
      token: props.token,
      phoneNumber: props.phoneNumber,
      owners: [],
    };
  }

  async fetch() {
    try {
      const { token, phoneNumber } = this.state;
      const data = await getOwners({ token, phoneNumber });
      let { owners } = data;
      console.log(owners);
      this.setState({
        owners,
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
  }

  async onRefresh() {
    this.setState({
      isFetching: true,
    });
    await this.fetch();;
    this.stopFetching();
  }

  stopFetching() {
    if (this.state.isFetching) {
      this.setState({ isFetching: false });
    }
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <MemberItem memberItem={item} navigation={navigation}/>
    )
  }

  render() {
    const { isFetching, owners } = this.state;
    return (
      <View style={styles.root}>
        <FlatList
          data={owners}
          keyExtractor={(owner) => owner.sid}
          renderItem={this.renderItem}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
          ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
          ListFooterComponent={() => {
            return (<View></View>)
          }
        }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
  container: {
    flex: 1,
  },
});

MemberList.defaultProps = {};

MemberList.propTypes = {}

const mapStateToProps = state => ({
  token: getToken(state),
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { },
)(MemberList);
