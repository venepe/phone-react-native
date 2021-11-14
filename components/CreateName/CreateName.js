import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import UpdateNameForm from '../Forms/UpdateName';
import R from '../../resources';

class CreateName extends Component {

  constructor(props) {
    super(props);
    this.onCreateName = this.onCreateName.bind(this);
  }

  onCreateName() {
    this.props.navigation.navigate('CreateAccount', {
      screen: 'CreateBirthdate',
      params: { },
    });
  }

  render() {
    return (
      <View style={styles.root}>
        <UpdateNameForm onUpdateName={this.onCreateName} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
});

export default CreateName;
