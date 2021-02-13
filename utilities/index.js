export const getPathParams = (path) => {
  let pathParams = {};
  let pathAndParams = path.split('/');
  for (let i = 1; i < pathAndParams.length; i = i + 2) {
    pathParams[pathAndParams[i]] = pathAndParams[i + 1];
  }
  return pathParams;
}

export const getInvitationUrl = (accountId) => {
  return `https://anumberforus.com/invitations/${accountId}`;
}

export const isUUID = (text) => {
  const expression = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
  const regex = new RegExp(expression);
  return text.match(regex);
}
