import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import _ from 'lodash';
import Contacts from 'react-native-contacts';
import parsePhoneNumber from 'libphonenumber-js';
import { requestContactsPermission } from '../../utilities/permissions';
import { compareFullname, getReadableNumber } from '../../utilities/phone';
import ContactItem from './ContactItem';
import R from '../../resources';

class ContactList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.loadContacts = this.loadContacts.bind(this);
    this.state = {
      contacts: [],
      query: props.query,
    }
  }

  async componentDidMount() {
    await requestContactsPermission();
    await this.loadContacts();
  }

  async loadContacts() {
    let contacts = await Contacts.getAll();
    contacts = contacts.map(contact => {
      let phoneNumber= '';
      if (contact.phoneNumbers.length > 0) {
        phoneNumber = contact.phoneNumbers[0].number;
      }
      return {
        fullName: `${contact.givenName} ${contact.familyName}`,
        phoneNumber,
      };
    });

    contacts.sort(compareFullname);

    this.setState({
      contacts,
    });
  }


  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.contacts !== prevProps.contacts) {
      this.setState({
        contacts: props.contacts,
      });
    }
    if (props.query !== prevProps.query) {
      this.setState({
        query: props.query,
      });
    }
  }

  async onPressRow(item) {
    const { phoneNumber: query } = item;
    const phoneNumber = parsePhoneNumber(query, 'US');
    if (phoneNumber && phoneNumber.isValid()) {
      const targetNumber = phoneNumber.number;
      const title = await getReadableNumber(targetNumber);
      this.props.navigation.replace('Messages', {
        screen: 'ChatDetail',
        params: { title, targetNumber },
      });
    }
  }

  renderItem({ item, index }) {
    return (
      <ContactItem contactItem={item} key={index} rowID={index} onPress={this.onPressRow} />
    )
  }

  render() {
    let { contacts, query } = this.state;
    if (query && query.length > 0) {
      query = query.toLowerCase();
      contacts = _.filter(contacts, (contact) => {
        return contact.fullName.toLowerCase().indexOf(query) > 0 || contact.phoneNumber.indexOf(query) > 0;
      });
    }
    if (contacts.length > 0) {
      let list = contacts;
      return (
        <View style={styles.root}>
          <FlatList
            data={list}
            keyExtractor={(contact) => contact.name}
            renderItem={this.renderItem}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}></View>
      )
    }
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
});

ContactList.defaultProps = {};

ContactList.propTypes = {}

export default ContactList;
