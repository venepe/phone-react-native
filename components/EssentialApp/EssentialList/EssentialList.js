import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  PermissionsAndroid,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import _ from 'lodash';
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import EssentialListItem from './EssentialListItem';
import Empty from './Empty';
import { requestEssentials, requestDeleteEssential, requestUpdateEssential } from '../../../actions/essential';
import { getToken, getAccountId } from '../../../reducers';
import { getEssentials } from '../../../reducers/essential';
import { initSocket } from '../../../utilities/socket';
import analytics, { EVENTS } from '../../../analytics';
import R from '../../../resources';

class EssentialList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.onCreateEssentialList = this.onCreateEssentialList.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.state = {
      isFetching: false,
      token: props.token,
      accountId: props.accountId,
      essentials: [],
    };
  }

  async fetch() {
    try {
      this.props.requestEssentials();
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    const { accountId } = this.state;
    initSocket({ accountId });
    this.fetch();
    analytics.track(EVENTS.VIEWED_SHOPPING_LISTS);
  }

  async componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
    if (props.accountId !== prevProps.accountId) {
      this.setState({
        accountId: props.accountId,
      });
    }
    if (props.essentials !== prevProps.essentials) {
      this.setState({
        essentials: props.essentials,
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

  onCreateEssentialList() {
    this.props.navigation.navigate('EssentialStack', { screen: 'CreateEssential' });
  }

  async onPressRow({ id }) {
    this.props.requestUpdateEssential({ essentialId: id });
  }

  onDelete({ id }) {
    this.props.requestDeleteEssential({ essentialId: id });
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <EssentialListItem essentialListItem={item} navigation={navigation} onPressRow={this.onPressRow} onDelete={this.onDelete}/>
    )
  }

  render() {
    const { isFetching, essentials } = this.state;
    return (
      <View style={styles.root}>
        <FlatList
          data={essentials}
          keyExtractor={(essentials) => essentials.id}
          renderItem={this.renderItem}
          refreshControl={(<RefreshControl tintColor={R.colors.TEXT_MAIN}
            progressBackgroundColor={R.colors.BACKGROUND_DARK}  colors={[R.colors.TEXT_MAIN]}
            refreshing={isFetching} onRefresh={() => this.onRefresh()} />)}
          ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
          ListFooterComponent={() => {
            return (<View></View>)
          }
        }
        />
        <FAB
          color={R.colors.TEXT_MAIN}
          style={styles.fab}
          large
          icon='plus'
          onPress={() => this.onCreateEssentialList()}
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 15,
    bottom: 30,
  },
});

EssentialList.defaultProps = {};

EssentialList.propTypes = {}

const mapStateToProps = state => ({
  token: getToken(state),
  accountId: getAccountId(state),
  essentials: getEssentials(state),
});

export default connect(
  mapStateToProps,
  { requestEssentials, requestDeleteEssential, requestUpdateEssential },
)(EssentialList);
