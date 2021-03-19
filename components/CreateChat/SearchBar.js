import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import { Input } from 'react-native-elements';
import parsePhoneNumber from 'libphonenumber-js';
import { getReadableNumber } from '../../utilities/phone';
import R from '../../resources';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.onPress = this.onPress.bind(this);
    this.state = {
      query: '',
    }
  }

  onChangeText(query) {
    this.setState({
      query,
    });
    this.props.onUpdateQuery(query);
  }

  async onPress() {
    let { query } = this.state;
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

  render() {
    const { query } = this.state;
    return (
      <Input
        value={query}
        onChangeText={value => this.onChangeText(value)}
        placeholder='Enter number or name'
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        containerStyle={styles.container}
        returnKeyType='done'
        onSubmitEditing={this.onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    color: R.colors.TEXT_MAIN,
    backgroundColor: R.colors.HEADER_MAIN,
  },
  leftIconContainerStyle: {
    color: R.colors.TEXT_MAIN,
  },
  inputContainerStyle: {
    backgroundColor: R.colors.SEARCH_INPUT_CONTAINER,
    marginTop: 10,
  },
  inputStyle: {
    color: R.colors.TEXT_MAIN,
    marginLeft: 10,
    padding: 0,
  },
});

SearchBar.defaultProps = {

};

SearchBar.propTypes = {
  onUpdateQuery: () => {},
}

export default SearchBar;
