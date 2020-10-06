const typeDefs = `
    type Message {
        id: ID!
        user: String!
        message: String!
    }

    type Query {
        messages: [Message!]
    }
    
    type Mutation {
        createMessage(user: String! message: String!): Message!
    }

    type Subscription {
        newMessage: Message
    }
`;

module.exports = typeDefs;