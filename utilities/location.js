import { Alert } from 'react-native';
import * as Location from 'expo-location';
import PermissionStatus from '../constants/PermissionStatus';
import R from '../resources';

const getCurrentPosition = async () => {
  const { coords } = await Location.getCurrentPositionAsync({});
  const location = coords;
  const { latitude, longitude } = location;
  return { latitude, longitude };
}

export const requestLocation = async () => {
    let { status } = await Location.getPermissionsAsync();
    if (status === PermissionStatus.GRANTED) {
      const location = await getCurrentPosition();
      return location;
    } else {
      Alert.alert(
        R.strings.LABEL_LOCATION_PERMISSION_TITLE,
        R.strings.LABEL_LOCATION_PERMISSION_MESSAGE,
        [
          { text: R.strings.LABEL_OKAY, onPress: async () =>  {
            let { status } = await Location.requestPermissionsAsync();
            if (status === PermissionStatus.GRANTED) {
              await getCurrentPosition();
            } else {

            }
          }}
        ],
        { cancelable: false }
      );
      return {
        latitude: null,
        longitude: null,
      };
    }
  }
