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

export const finishAndFormatNumber = (phoneNumber = '') => {
  phoneNumber = phoneNumber.replace(/\D/g,'');
  if (phoneNumber[0] == '1') {
    phoneNumber = phoneNumber.substring(1);
  }
  if (phoneNumber.length > 10) {
    phoneNumber = phoneNumber.substring(0, 10);
  }
  while (phoneNumber.length < 10) {
    phoneNumber = `${phoneNumber}${Math.floor(Math.random() * 10)}`;
  }
  phoneNumber = `+1${phoneNumber}`
  return phoneNumber;
}
