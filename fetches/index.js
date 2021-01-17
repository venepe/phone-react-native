import { API_URL } from '../config';

export const getAvailableNumbers = ({ latitude, longitude }) => {
  return fetch(`${API_URL}/phone-numbers/available?lat=${latitude}&lon=${longitude}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
};
