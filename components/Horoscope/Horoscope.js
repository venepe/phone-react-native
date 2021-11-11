import React, { Component } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import OwnerList from './OwnerList';
import { getHoroscopes } from '../../fetches';
import { getToken, getUserId } from '../../reducers';
import R from '../../resources';

const SECTION_LIST = [
  {
    title: 'Sign',
    data: [],
  },
  {
    title: 'Description',
    data: [],
  },
  {
    title: 'Compatibility',
    data: [],
  },
  {
    title: 'Mood',
    data: [],
  },
  {
    title: 'Color',
    data: [],
  },
  {
    title: 'Lucky Number',
    data: [],
  },
  {
    title: 'Lucky Time',
    data: [],
  },
];

class Horoscope extends Component {

  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.onUpdateSelectedUserId = this.onUpdateSelectedUserId.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.state = {
      token: props.token,
      data: SECTION_LIST,
      selectedUserId: props.userId,
    }
  }

  async componentDidMount() {
    const { selectedUserId: userId } = this.state;
    this.fetch({ userId });
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  async fetch({ userId }) {
    try {
      let { data, token } = this.state;
      const { horoscope: { sign, description, compatibility, mood,
        color, luckyNumber, luckyTime } } = await getHoroscopes({ token, userId });
      const values = [ sign, description, compatibility, mood, color, luckyNumber, luckyTime ];
      values.forEach((item, i) => {
        data[i].data = [];
        data[i].data.push(item);
      });

      this.setState({
        data,
      });
    } catch (e) {
      console.log('erre');
        console.log(e);
    }
  }

  renderItem({ item }) {
    return (
      <View
        style={styles.rowContainer}
      >
        <Text style={styles.rowText}>{item}</Text>
      </View>
    )
  }

  renderSectionHeader({ section: { title } }) {
    return (
      <Text style={styles.sectionText}>{title}</Text>
    )
  }

  onUpdateSelectedUserId({ userId }) {
    this.setState({ selectedUserId: userId });
    this.fetch({ userId });
  }

  render() {
    const { data, selectedUserId } = this.state;
    return (
      <View style={styles.root}>
        <OwnerList selectedUserId={selectedUserId} onUpdateSelectedUserId={this.onUpdateSelectedUserId} />
        <SectionList
          sections={data}
          keyExtractor={(item, i) => i}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    marginRight: 40,
    marginLeft: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: R.colors.GREY_BACKGROUND,
  },
  rowText: {
    fontSize: 16,
    marginLeft: 20,
    fontWeight: 'bold',
    color: R.colors.TEXT_MAIN,
  },
  sectionText: {
    flex: 1,
    height: 20,
    fontSize: 16,
    marginLeft: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: R.colors.TEXT_MAIN,
  },
});

const mapStateToProps = state => ({
  token: getToken(state),
  userId: getUserId(state),
});

export default connect(
  mapStateToProps,
  { },
)(Horoscope);
