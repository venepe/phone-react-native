import * as Location from 'expo-location';
import PermissionStatus from '../constants/PermissionStatus';
import R from '../resources';

const DEFAULT_LOCATION = {
  latitude: '41.8781',
  longitude: '-87.6298',
};

const getCurrentPosition = async () => {
  const { coords } = await Location.getCurrentPositionAsync({});
  const location = coords;
  const { latitude, longitude } = location;
  return { latitude, longitude };
}

export const requestLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status === PermissionStatus.GRANTED) {
        const location = await getCurrentPosition();
        return location;
      } else {
        return DEFAULT_LOCATION;
      }
    } catch (e) {
      console.log(e);
      return DEFAULT_LOCATION;
    }
  }
