import gql from 'graphql-tag';

const NotificationQuery = gql`
    query {
        notifications {
            label
        }
    }
`;

const PushNotificationMutation = gql`
    mutation($label: String!) {
        pushNotification(label: $label) {
            label
        }
    }
`;

const NotificationSubscription = gql`
    subscription {
        newNotification {
            label
        }
    }
`;

export {
    NotificationQuery,
    PushNotificationMutation,
    NotificationSubscription,
};