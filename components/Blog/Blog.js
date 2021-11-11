import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { BLOG_PAGE } from '../../config';
import R from '../../resources';

class Blog extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {

  }

  render() {
      return (
        <View style={styles.root}>
          <WebView
            style={styles.container}
            source={{ uri: BLOG_PAGE }}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
  container: {
    flex: 1,
  },
});

Blog.defaultProps = {};

Blog.propTypes = {};

export default Blog;
