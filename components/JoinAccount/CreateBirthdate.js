import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import UpdateBirthdateForm from '../Forms/UpdateBirthdate';
import { postOwners } from '../../fetches';
import { setIsActive } from '../../actions';
import { getToken, getAccountId } from '../../reducers';
import { showCongratulationsAlert } from '../../utilities/alert';
import R from '../../resources';

class CreateBirthdate extends Component {

  constructor(props) {
    super(props);
    this.onCreateBirthdate = this.onCreateBirthdate.bind(this);
    this.state = {
      token: props.token,
      accountId: props.accountId,
    };
  }

  async onCreateBirthdate() {
    const { token, accountId } = this.state;
    try {
      const data = await postOwners({ token, accountId });
      let { owner } = data;
      if (owner) {
        this.props.setIsActive({ payload: { isActive: true } });
        showCongratulationsAlert();
      }
    } catch (e) {
      console.log(e);
    }
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

const mapStateToProps = state => ({
  accountId: getAccountId(state),
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { setIsActive },
)(CreateBirthdate);
