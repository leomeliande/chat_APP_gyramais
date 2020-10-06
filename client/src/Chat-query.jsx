import gql from 'graphql-tag';

const MessageQuery = gql`
  query {
    messages {
      id
      user
      message
    }
  }
`;

const CreateMessageMutation = gql`
  mutation (
      $user: String!
      $message: String!
  ) {
    createMessage(
      message: $message
      user: $user
    ) {
      id
      user
      message
    }
  }
`;

const MessageSubscription = gql`
  subscription {
    newMessage {
      id
      user
      message
    }
  }
`;

export {
  MessageQuery,
  CreateMessageMutation,
  MessageSubscription,
};