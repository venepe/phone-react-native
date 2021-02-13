import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import { SearchBar as ElementsSearchBar } from 'react-native-elements';
import parsePhoneNumber, { AsYouType } from 'libphonenumber-js';
import { finishAndFormatNumber } from '../../utilities/phone';
import R from '../../resources';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onClear = this.onClear.bind(this);
    this.state = {
      query: '',
    }
  }

  onChangeText(text) {
    let { query: previousQuery } = this.state;
    let query = new AsYouType('US').input(text);
    if (query === previousQuery) {
      query = query.substring(0, query.length - 2);
      query = new AsYouType('US').input(query);
    }
    this.setState({
      query,
    });
  }

  onClear() {
    const query = '';
    this.setState({
      query,
    });
    this.props.onSearch({ query });
  }

  onPress() {
    let { query } = this.state;
    if (query.length > 0) {
      query = finishAndFormatNumber(query);
    }
    this.props.onSearch({ query });
  }

  render() {
    const { query } = this.state;
    return (
      <ElementsSearchBar
         value={query}
         platform={Platform.OS}
         placeholder={'Search'}
         cancelIcon={{ type: 'font-awesome', name: 'chevron-left', color: R.colors.TEXT_MAIN }}
         searchIcon={{color: R.colors.TEXT_MAIN}}
         clearIcon={{color: R.colors.TEXT_MAIN}}
         inputContainerStyle={styles.inputContainerStyle}
         inputStyle={styles.inputStyle}
         containerStyle={styles.container}
         leftIconContainerStyle={styles.leftIconContainerStyle}
         rightIconContainerStyle={styles.rightIconContainerStyle}
         round={false}
         lightTheme={false}
         autoCapitalize='none'
         autoCorrect={false}
         spellCheck={false}
         returnKeyType='search'
         onChangeText={value => this.onChangeText(value)}
         onSubmitEditing={this.onPress}
         onCancel={this.onClear}
         onClear={this.onClear}
         cancelButtonProps={{ color: R.colors.TEXT_MAIN }}
         keyboardType={'phone-pad'}
         maxLength={16}
       />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    color: R.colors.TEXT_MAIN,
    backgroundColor: R.colors.HEADER_MAIN,
    marginBottom: 2,
  },
  leftIconContainerStyle: {
    color: R.colors.TEXT_MAIN,
  },
  rightIconContainerStyle: {
    color: R.colors.TEXT_MAIN,
  },
  inputContainerStyle: {
    backgroundColor: R.colors.SEARCH_INPUT_CONTAINER,
  },
  inputStyle: {
    color: R.colors.TEXT_MAIN,
  },
});

SearchBar.defaultProps = {

};

SearchBar.propTypes = {
  onSearch: () => {},
}

export default SearchBar;
