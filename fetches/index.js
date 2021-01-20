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

export const getAccounts = ({ token }) => {
  return fetch(`${API_URL}/accounts`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
};

export const postAccounts = ({ token, phoneNumber }) => {
  return fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      account: {
        phoneNumber,
      },
    }),
  })
};

export const postInvitation = ({ token, phoneNumber }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/invitations`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
};

export const postOwn = ({ token, phoneNumber, code }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/owns`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      own: {
        code,
      },
    }),
  })
};

export const getMessages = ({ token, phoneNumber }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/messages`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
};

export const postMessage = ({ token, phoneNumber, to, body }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/messages`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: {
        to,
        body,
      },
    }),
  })
};

export const getCalls = ({ token, phoneNumber }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/calls`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
};
