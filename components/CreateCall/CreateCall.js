import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import _ from 'lodash';
import ContactList from './ContactList';
import SearchBar from './SearchBar';
import R from '../../resources';

class CreateCall extends Component {

  constructor(props) {
    super(props);
    this.onUpdateQuery = this.onUpdateQuery.bind(this);
    this.state = {
      targetNumber: '',
    };
  }

  async componentDidUpdate(prevProps) {
    const props = this.props;
  }

  onUpdateQuery(query) {
    this.setState({
      query,
    });
  }

  render() {
    const { navigation, route } = this.props;
    const { query } = this.state;
    return (
      <View style={styles.root}>
        <SearchBar onSearch={this.onSearch} onUpdateQuery={this.onUpdateQuery} navigation={navigation}/>
        <ContactList query={query} navigation={navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
});

CreateCall.defaultProps = {};

CreateCall.propTypes = {}

export default CreateCall;
