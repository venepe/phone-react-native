import Contacts from 'react-native-contacts';
import parsePhoneNumber from 'libphonenumber-js';

export const getFormattedNumber = (phoneNumber) => {
  let formattedPhoneNumber = '';
  if (phoneNumber && phoneNumber.length > 0) {
    let formatter = parsePhoneNumber(phoneNumber);
    if (formatter) {
      formattedPhoneNumber = formatter.formatNational();
    }
  }
  return formattedPhoneNumber;
}

export const getReadableNumber = async (from) => {
  let contacts = await Contacts.getContactsByPhoneNumber(from);
  if (contacts && contacts.length > 0) {
    let { givenName, familyName } = contacts[0];
    let name = `${givenName} ${familyName}`;
    return name;
  } else {
    return getFormattedNumber(from);
  }
}
