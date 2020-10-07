import gql from 'graphql-tag';

const MessageQuery = gql`
    query {
        messages {
            id
            user
            message
            timestamp
        }
    }
`;

const CreateMessageMutation = gql`
    mutation($user: String!, $message: String!, $timestamp: String!) {
        createMessage(user: $user, message: $message, timestamp: $timestamp) {
            id
            user
            message
            timestamp
        }
    }
`;

const MessageSubscription = gql`
    subscription {
        newMessage {
            id
            user
            message
            timestamp
        }
    }
`;

export {
  MessageQuery,
  CreateMessageMutation,
  MessageSubscription,
};