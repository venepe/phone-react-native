import { Alert } from 'react-native';
import { API_URL } from '../config';
import R from '../resources';

const handleResponse = async (response) => {
  const statusCode = response.status;
  const data = response.json();
  return Promise.all([statusCode, data]).then(([res, data]) => {
      if (res === 200) {
        return Promise.resolve(data)
      } else if (res === 400 && data.message) {
        Alert.alert(
          R.strings.ERROR_REQUEST_TITLE,
          data.message,
          [
            { text: R.strings.LABEL_OKAY },
          ],
          { cancelable: true }
        );
      } else {
        throw new Error(res.status);
      }
    })
    .catch((e) => {
      Alert.alert(
        R.strings.ERROR_REQUEST_TITLE,
        R.strings.ERROR_REQUEST_MESSAGE,
        [
          { text: R.strings.LABEL_OKAY },
        ],
        { cancelable: true }
      );
    });
}

export const postUser = ({ token }) => {
  return fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const getAvailableNumbers = ({ latitude, longitude, query }) => {
  return fetch(`${API_URL}/phone-numbers/available?lat=${latitude}&lon=${longitude}&query=${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then(handleResponse)
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
  .then(handleResponse)
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
  .then(handleResponse)
};

export const postInvitation = ({ token, code }) => {
  return fetch(`${API_URL}/invitations`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      invitation: {
        code,
      },
    }),
  })
  .then(handleResponse)
};

export const getInvitation = ({ token, invitationId }) => {
  return fetch(`${API_URL}/invitations/${invitationId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const postInvitationVerify = ({ token, invitation }) => {
  return fetch(`${API_URL}/invitations/verify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      verify: {
        invitation,
      },
    }),
  })
  .then(handleResponse)
};

export const getOwners = ({ token, phoneNumber }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/owners`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const postOwners = ({ token, phoneNumber, invitation }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/owners`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      owner: {
        invitation,
      },
    }),
  })
  .then(handleResponse)
};

export const deleteOwner = ({ token, phoneNumber }) => {
  return fetch(`${API_URL}/accounts/${phoneNumber}/owners/me`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
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
  .then(handleResponse)
};

export const postPublicKey = ({ token, publicKey }) => {
  return fetch(`${API_URL}/users/public-key`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user: {
        publicKey,
      },
    }),
  })
};
