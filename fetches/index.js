import { API_URL } from '../config';

const handleResponse = async (response) => {
  const statusCode = response.status;
  const data = response.json();
  return Promise.all([statusCode, data]).then(([res, data]) => {
      if (res === 200) {
        return Promise.resolve(data)
      } else {
        throw new Error(res.status);
      }
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
};

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
};

export const postOwners = ({ token, phoneNumber, invitation, receipt }) => {
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
        receipt,
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
