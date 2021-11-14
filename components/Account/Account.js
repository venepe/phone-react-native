import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { List } from 'react-native-paper';
import { connect } from 'react-redux';
import { getFormattedNumber } from '../../utilities/phone';
import { copyPhoneNumber } from '../../utilities/copy';
import { clearSession } from '../../utilities/auth';
import { getPhoneNumber } from '../../reducers';
import R from '../../resources';

const ADVICE_LIST = [
  {
    title: R.strings.TITLE_BLOG,
    icon: 'newspaper',
    iconSet: 'MaterialCommunityIcons',
  },
  {
    title: R.strings.TITLE_HOROSCOPE,
    icon: 'zodiac-aquarius',
    iconSet: 'MaterialCommunityIcons',
  },
];

const MANAGE_LIST = [
  {
    title: R.strings.TITLE_MEMBERS,
    icon: 'people',
    iconSet: 'MaterialIcons',
  },
  {
    title: R.strings.TITLE_INVITE,
    icon: 'share',
    iconSet: 'MaterialIcons',
  },
  {
    title: R.strings.TITLE_MANAGE,
    icon: 'settings',
    iconSet: 'MaterialIcons',
  },
  {
    title: R.strings.TITLE_LOGOUT,
    icon: 'cancel',
    iconSet: 'MaterialIcons',
  },
];

const SECTION_LIST = [
  {
    title: 'Advice',
    data: ADVICE_LIST,
  },
  {
    title: 'Account',
    data: MANAGE_LIST,
  }
];

class Account extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      phoneNumber: props.phoneNumber,
    }
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        phoneNumber: props.phoneNumber,
      });
    }
  }

  async onPressRow(item) {
    const { navigation } = this.props;
    const { title } = item;
    switch (title) {
      case R.strings.TITLE_BLOG:
        navigation.navigate('Blog')
        break;
      case R.strings.TITLE_HOROSCOPE:
        navigation.navigate('Horoscope')
        break;
      case R.strings.TITLE_MEMBERS:
        navigation.navigate('Members')
        break;
      case R.strings.TITLE_INVITE:
        navigation.navigate('ShareInvite')
        break;
      case R.strings.TITLE_MANAGE:
        navigation.navigate('Manage')
        break;
      case R.strings.TITLE_LOGOUT:
        await clearSession();
        break;
      default:
    }
  }

  renderIcon({ icon, iconSet }) {
    if (iconSet === 'MaterialCommunityIcons') {
      return (<MaterialCommunityIcons name={icon} color={R.colors.TEXT_MAIN} size={28} />);
    } else {
      return (<MaterialIcons name={icon} color={R.colors.TEXT_MAIN} size={28} />);
    }
  }

  renderItem({ item }) {
    const { title, icon, iconSet } = item;
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        onPress={() => this.onPressRow(item)}>
        {this.renderIcon({ icon, iconSet })}
        <Text style={styles.rowText}>{title}</Text>
      </TouchableOpacity>
    )
  }

  renderSectionHeader({ section: { title } }) {
    return (
      <Text style={styles.sectionText}>{title}</Text>
    )
  }

  render() {
    const { navigation } = this.props;
    const { phoneNumber } = this.state;
      return (
        <View style={styles.root}>
          <TouchableOpacity
            style={styles.header}
            onLongPress={() => copyPhoneNumber()}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.title}>{getFormattedNumber(phoneNumber)}</Text>
          </TouchableOpacity>
          <SectionList
            sections={SECTION_LIST}
            keyExtractor={(item) => item.title}
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
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 5,
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
  title: {
    fontSize: 36,
    marginTop: 20,
    marginLeft: 20,
    fontWeight: 'bold',
    color: R.colors.TEXT_MAIN,
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

Account.defaultProps = {};

Account.propTypes = {};

const mapStateToProps = state => ({
  phoneNumber: getPhoneNumber(state),
});

export default connect(
  mapStateToProps,
  { },
)(Account);
