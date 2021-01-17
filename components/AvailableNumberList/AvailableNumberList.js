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
import AvailableNumberItem from '../AvailableNumberItem';
import Empty from './Empty';
import { getAvailableNumbers } from '../../fetches';
import { requestLocation } from '../../utilities/location';
import { getUserId } from '../../reducers';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class AvailableNumberList extends Component {

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
      phoneNumbers: [],
    };
  }

  async componentDidMount() {
    const { latitude, longitude } = await requestLocation();
    try {
      const response = await getAvailableNumbers({ latitude, longitude });
      const statusCode = response.status;
      const data = await response.json();
      if (response.status === 200) {
        let { phoneNumbers } = data;
        this.setState({
          location: { latitude, longitude },
          phoneNumbers,
          didLoadLocation: true,
        });
      } else {

      }
    } catch (e) {
      console.log(e);
    }
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
      <AvailableNumberItem availableNumberItem={item} navigation={navigation}/>
    )
  }

  render() {
    const { isFetching, location, userId, phoneNumbers, didLoadLocation } = this.state;
    const { latitude, longitude } = location;
    if (!didLoadLocation) {
      return (<Blank/>);
    }
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <FlatList
            data={phoneNumbers}
            keyExtractor={(node) => node.nodeId}
            renderItem={this.renderItem}
            onRefresh={() => this.onRefresh(refetch)}
            refreshing={isFetching}
            ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
            ListFooterComponent={() => {
              return (<View></View>)
            }
          }
          />
        </View>
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

AvailableNumberList.defaultProps = {};

AvailableNumberList.propTypes = {}

const mapStateToProps = state => ({
  userId: getUserId(state),
});

export default connect(
  mapStateToProps,
  { },
)(AvailableNumberList);
