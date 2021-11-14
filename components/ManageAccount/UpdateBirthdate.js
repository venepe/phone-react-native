import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import UpdateBirthdateForm from '../Forms/UpdateBirthdate';
import R from '../../resources';

class CreateBirthdate extends Component {

  constructor(props) {
    super(props);
    this.onCreateBirthdate = this.onCreateBirthdate.bind(this);
  }

  onCreateBirthdate() {
    this.props.navigation.navigate('Account');
  }

  render() {
    return (
      <View style={styles.root}>
        <UpdateBirthdateForm onUpdateBirthdate={this.onCreateBirthdate} />
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

export default CreateBirthdate;
