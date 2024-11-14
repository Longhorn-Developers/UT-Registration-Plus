import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) =>
    // Return the headers to the context so httpLink can read them
    ({
        headers: {
            ...headers,
            authorization: `bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
    })
);

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
