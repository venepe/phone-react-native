export const getInvitationUrl = (accountId) => {
  return `https://invite.anumberforus.com/invitations/${accountId}`;
}

export const isUUID = (text) => {
  const expression = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
  const regex = new RegExp(expression);
  return text.match(regex);
}
