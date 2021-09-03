import { PermissionsAndroid, Platform } from 'react-native';

export const requestContactsPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'Bubblepop needs access to access your contacts to display contact information.  Otherwise you\'ll just see a number.',
        buttonPositive: 'Okay'
      }
    )
  }
}

export const requestMicrophonePermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone',
        message: 'Bubblepop needs access to access your microphone in order to make calls.',
        buttonPositive: 'Okay'
      }
    )
  }
}
