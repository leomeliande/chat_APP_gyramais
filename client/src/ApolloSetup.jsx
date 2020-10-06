import {
    ApolloClient,
    InMemoryCache,
} from "@apollo/client";

import { WebSocketLink } from "@apollo/client/link/ws";
import { split } from '@apollo/client/link/core';
import { HttpLink } from '@apollo/client/link/http';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from "@apollo/client/link/error";

const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect: true,
    },
});

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/'
});

const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const error = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
        console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
    );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

export default new ApolloClient({
    cache: new InMemoryCache(),
    link,
    error,
});