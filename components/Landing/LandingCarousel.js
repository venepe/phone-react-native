import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import R from '../../resources';
const SCREEN_WIDTH = Dimensions.get('window').width;

class LandingCarousel extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.state = {
      entries: [{
        title: 'Hello World',
      }],
    };
  }

  renderItem = ({item, index}) => {
    return (
      <View style={styles.root}>
        <Image resizeMode={'contain'} style={styles.image} source={{uri: 'https://image.freepik.com/free-photo/beautiful-couple-spend-time-autumn-park_1157-21382.jpg'}}></Image>
        <Text style={styles.title}>{ item.title }</Text>
      </View>
    );
  }

  render() {
    return (
      <Carousel
        data={this.state.entries}
        renderItem={this.renderItem}
        sliderWidth={SCREEN_WIDTH}
        itemWidth={SCREEN_WIDTH}
      />
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_MAIN,
  },
  image: {
    flex: 1,
  },
  title: {
    color: R.colors.TEXT_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LandingCarousel;
