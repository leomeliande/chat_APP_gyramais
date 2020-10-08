const typeDefs = `
    type Message {
        id: ID!
        user: String!
        message: String!
        timestamp: String!
    }

    type Notification { 
        label: String!
    }

    type Query {
        messages: [Message!]
        notifications: [Notification!]
    }
    
    type Mutation {
        createMessage(user: String! message: String! timestamp: String!): Message!
        pushNotification(label: String!): Notification!
    }

    type Subscription {
        newMessage: Message
        newNotification: Notification
    }
`;

module.exports = typeDefs;