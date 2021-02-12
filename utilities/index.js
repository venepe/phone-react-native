
export const getPathParams = (path) => {
  let pathParams = {};
  let pathAndParams = path.split('/');
  for (let i = 1; i < pathAndParams.length; i = i + 2) {
    pathParams[pathAndParams[i]] = pathAndParams[i + 1];
  }
  return pathParams;
}
