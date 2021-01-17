import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { RetryLink } from 'apollo-link-retry';
import { GRAPHQL_URL } from './config';
import { getStore } from './store';
import introspectionQueryResultData from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({ fragmentMatcher });

persistCache({
  cache,
  storage: AsyncStorage,
});
const httpLink = new HttpLink({ uri: GRAPHQL_URL });

const stateLink = withClientState({
  cache,
  defaults: {},
  resolvers: {},
});

const recoveryLink = new RetryLink({
	delay: {
		initial: 0,
	},
	attempts: {
		max: 5,
		retryIf: (error: ResponseError, operation) => {
			if (error.statusCode === 401 || error.statusCode === 403) {
				getStore().dispatch(renewToken());
			}
			return false;
		}
	}
});

const authLink = setContext((_, { headers }) => {
  const token = getStore().getState().token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([recoveryLink, stateLink, authLink, httpLink]),
  cache,
  assumeImmutableResults: true,
});

export const getApolloClient = () => {
  return client;
};

export default client;
