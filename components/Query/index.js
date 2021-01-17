import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import R from '../../resources';

export const IS_FETCHING_MORE = 3;
export const FIRST_5 = 5;
export const FIRST_25 = 25;

export const QueryWrapper = ({ children, ...rest }) => (
  <Query {...rest}>
    {({ loading, error, data, fetchMore, networkStatus, refetch }) => {
      if (loading && networkStatus !== 3) {
        return (
          <ActivityIndicator style={styles.spinner} size='large' color={R.colors.TEXT_MAIN} />
        );
      }

      if (error) {
        return (
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Text style={styles.error} type='error'>{`${error.message}`}</Text>
            <Button color={R.colors.CONTENT_BACKGROUND} onPress={() => {refetch()}} title={'Retry?'}></Button>
          </View>
        );
      }

      return children({ loading, error, data, fetchMore, networkStatus, refetch })
    }}
  </Query>
)

const styles = StyleSheet.create({
  error: {
    color: R.colors.TEXT_MAIN,
    padding: 10,
  },
  spinner: {
    padding: 15,
  },
});

QueryWrapper.propTypes = {
  children: PropTypes.func.isRequired,
}

export default QueryWrapper
