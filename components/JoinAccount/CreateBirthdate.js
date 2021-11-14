import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import UpdateBirthdateForm from '../Forms/UpdateBirthdate';
import { setIsActive } from '../../actions';
import { showCongratulationsAlert } from '../../utilities/alert';
import R from '../../resources';

class CreateBirthdate extends Component {

  constructor(props) {
    super(props);
    this.onCreateBirthdate = this.onCreateBirthdate.bind(this);
  }

  onCreateBirthdate() {
    this.props.setIsActive({ payload: { isActive: true } });
    showCongratulationsAlert();
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

export default connect(
  null,
  { setIsActive },
)(CreateBirthdate);
