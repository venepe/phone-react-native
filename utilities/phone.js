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
