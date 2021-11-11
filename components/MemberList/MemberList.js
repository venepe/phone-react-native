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
import MemberItem from './MemberItem';
import Empty from './Empty';
import { requestOwners } from '../../actions';
import { getOwners } from '../../reducers';
import R from '../../resources';

class MemberList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.state = {
      isFetching: false,
      owners: props.owners,
    };
  }

  async fetch() {
    this.props.requestOwners();
  }

  componentDidMount() {
    if (this.state.owners.length > 0) {
      this.setState({ isFetching: true });
    }
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.owners !== prevProps.owners) {
      this.setState({
        owners: props.owners,
        isFetching: false,
      });
    }
  }

  onRefresh() {
    this.setState({
      isFetching: true,
    });
    this.fetch();
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
  owners: getOwners(state),
});

export default connect(
  mapStateToProps,
  { requestOwners },
)(MemberList);
