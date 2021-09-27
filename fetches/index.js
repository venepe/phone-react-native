import { Alert } from 'react-native';
import { API_URL } from '../config';
import R from '../resources';

const handleResponse = async (response) => {
  const statusCode = response.status;
  const data = response.json();
  return Promise.all([statusCode, data]).then(([res, data]) => {
      if (res === 200) {
        return Promise.resolve(data);
      } else if (res === 400 && data.message) {
        Alert.alert(
          R.strings.ERROR_REQUEST_TITLE,
          data.message,
          [
            { text: R.strings.LABEL_OKAY },
          ],
          { cancelable: true }
        );
      } else if (res === 403 && data.message) {
        return Promise.resolve(data);
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

export const postUser = ({ token = '' }) => {
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

export const getAccounts = ({ token = '' }) => {
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

export const postAccounts = ({ token, phoneNumber, receipt }) => {
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
        receipt,
      },
    }),
  })
  .then(handleResponse)
};

export const getAccountById = ({ accountId }) => {
  return fetch(`${API_URL}/accounts/${accountId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then(handleResponse)
};

export const getOwners = ({ token, accountId }) => {
  return fetch(`${API_URL}/accounts/${accountId}/owners`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const postOwners = ({ token, accountId }) => {
  return fetch(`${API_URL}/accounts/${accountId}/owners`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const deleteOwner = ({ token, accountId }) => {
  return fetch(`${API_URL}/accounts/${accountId}/owners/me`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const getMessages = ({ token = '', accountId }) => {
  return fetch(`${API_URL}/accounts/${accountId}/messages`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const postMessages = ({ token, to, text, accountId }) => {
  return fetch(`${API_URL}/accounts/${accountId}/messages`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: {
        to,
        text,
      },
    }),
  })
  .then(handleResponse)
};

export const getCalls = ({ token = '', accountId }) => {
  return fetch(`${API_URL}/accounts/${accountId}/calls`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const getActivationToken = ({ token = '', accountId, platform }) => {
  return fetch(`${API_URL}/accounts/${accountId}/activation-token?platform=${platform}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const postNotification = ({ token = '', notificationToken, device }) => {
  fetch(`${API_URL}/notifications`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      notification: {
        notificationToken,
        device,
      },
    }),
  })
};

export const postResendVerificationEmail = ({ token }) => {
  fetch(`${API_URL}/verification-email`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
};

export const getMe = ({ token }) => {
  return fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

export const putUser = ({ token, name }) => {
  return fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user: {
        name,
      },
    }),
  });
};

export const postUserLogout = ({ token }) => {
  return fetch(`${API_URL}/users/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
};
