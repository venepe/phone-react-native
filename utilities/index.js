import branch from 'react-native-branch';

export const getInvitationUrl = async (accountId) => {
  let branchUniversalObject = await branch.createBranchUniversalObject(accountId);
  let canonicalUrl = `https://invite.anumberforus.com/invitations/${accountId}`;
  let controlParams = {
    $canonical_url: canonicalUrl,
  };
  let { url } = await branchUniversalObject.generateShortUrl({}, controlParams);
  return url;
}

export const isUUID = (text) => {
  const expression = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
  const regex = new RegExp(expression);
  return text.match(regex);
}
