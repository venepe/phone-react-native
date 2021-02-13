import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { postOwners} from '../../fetches';
import { storeAndSetActiveUser} from '../../actions';
import { getToken } from '../../reducers';
import { showConfirmJoinAlert, showCongratulationsAlert } from '../../utilities/alert';
import { login } from '../../utilities/auth';

import R from '../../resources';

class JoinCode extends Component {

  constructor(props) {
    super(props);
    const { invitation: accountId } = props.route.params;
    this.state = {
      accountId,
      token: props.token,
      isLoading: false,
    };
  }

  async componentDidMount() {
    const { accountId } = this.state;
    this.setState({ isLoading: true });
    try {
      const credentials = await login();
      showConfirmJoinAlert({ }, () => this.purchase());
    } catch (e) {
      this.setState({ isLoading: false, didLogin: false });
      console.log(e);
    }
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
  }

  async purchase() {
    const { token, accountId } = this.state;
    try {
      const data = await postOwners({ token, accountId });
      let { owner } = data;
      if (owner) {
        const { phoneNumber } = owner;
        this.props.storeAndSetActiveUser({ payload: { accountId, phoneNumber, isActive: true } });
        showCongratulationsAlert();
      }
      this.setState({ isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      this.props.navigation.navigate('Welcome', {
        screen: 'LandingTwo'
      });
      console.log(e);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-end' }]}
              source={require('../../assets/couple_three.png')}
            />
          </View>
          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.BACKGROUND_MAIN} />
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, { alignSelf: 'flex-start' }]}
              source={require('../../assets/couple_four.png')}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#18FFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 200,
    margin: 20,
  },
  spinner: {
    height: 35,
  },
});

const mapStateToProps = state => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  { storeAndSetActiveUser },
)(JoinCode);
