import { PermissionsAndroid, Platform } from 'react-native';

export const requestContactsPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'Tandem needs access to access your contacts to display contact information.  Otherwise you\'ll just see a number.',
        buttonPositive: 'Okay'
      }
    )
  }
}
