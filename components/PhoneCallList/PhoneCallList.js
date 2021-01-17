import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Blank from '../Blank';
import DealItem from '../DealItem';
import Empty from './Empty';
import Query, { IS_FETCHING_MORE, FIRST_25, FIRST_5 } from '../Query';
import { HOT_DEALS } from '../../queries';
import { requestLocation } from '../../actions';
import { getUserId } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class PhoneCallList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.state = {
      isFetching: false,
      location: props.location,
      userId: props.userId,
      didLoadLocation: false,
      location: {
        latitude: null,
        longitude: null,
      },
    };
  }

  async componentDidMount() {
    const location = await requestLocation();
    this.setState({ didLoadLocation: true, location });
    analytics.track(EVENTS.VIEW_DEALS);
  }



  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.userId !== prevProps.userId) {
      this.setState({
        userId: props.userId,
      });
    }
  }

  async onRefresh(refetch) {
    this.setState({
      isFetching: true,
    });
    const location = await requestLocation();
    this.setState({ location });
    await refetch();
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
      <DealItem dealItem={item} navigation={navigation}/>
    )
  }

  render() {
    const { isFetching, location, userId, didLoadLocation } = this.state;
    const { latitude, longitude } = location;
    if (!didLoadLocation) {
      return (<Blank/>);
    }
    return (
      <View style={styles.root}>
        <Query
        query={HOT_DEALS}
        variables={{
          geo: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          userId,
          first: FIRST_25,
          after: null,
        }}
        notifyOnNetworkStatusChange={true}
      >
        {({ data: { hotDeals }, refetch, fetchMore, networkStatus }) => {
          let list = [];
          if (hotDeals && hotDeals.edges.length > 0) {
            list = hotDeals.edges.map(({ node }) => {
              return { ...node };
            });
          }
          analytics.track(EVENTS.VIEW_DEALS, { number: list.length });
          return (
            <View style={styles.container}>
              <FlatList
                data={list}
                keyExtractor={(node) => node.nodeId}
                renderItem={this.renderItem}
                onRefresh={() => this.onRefresh(refetch)}
                refreshing={isFetching}
                ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
                ListFooterComponent={() => {
                  if (hotDeals && hotDeals.pageInfo.hasNextPage && networkStatus !== IS_FETCHING_MORE) {
                      return (
                        <TouchableOpacity style={styles.moreContainer} onPress={() => {
                          fetchMore({
                              variables: { first: FIRST_25, after: hotDeals.pageInfo.endCursor },
                              updateQuery: (previousResult, { fetchMoreResult }) => {
                                return {
                                  hotDeals: {
                                    edges: [
                                      ...previousResult.hotDeals.edges,
                                      ...fetchMoreResult.hotDeals.edges,
                                    ],
                                    pageInfo: fetchMoreResult.hotDeals.pageInfo,
                                    __typename: hotDeals.__typename,
                                  },
                                };
                              },
                            });
                          }}
                        >
                        <MaterialIcons name='keyboard-arrow-down' size={40} color={R.colors.TEXT_MAIN} />
                      </TouchableOpacity>);
                  } else if (networkStatus === IS_FETCHING_MORE) {
                    return (<ActivityIndicator size='large' color={R.colors.TEXT_MAIN} />)
                  } else {
                    return (<View></View>)
                  }
                }
              }
              />
            </View>
          )
        }}
        </Query>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  container: {
    flex: 1,
  },
  moreContainer: {
    alignItems: 'center',
  },
});

PhoneCallList.defaultProps = {};

PhoneCallList.propTypes = {}

const mapStateToProps = state => ({
  userId: getUserId(state),
});

export default connect(
  mapStateToProps,
  { },
)(PhoneCallList);
