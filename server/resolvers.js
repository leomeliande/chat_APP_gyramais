const { 
  PubSub, 
  GraphQLServer,
  withFilter  
} = require("graphql-yoga");

const pubsub = new PubSub();
const Messages = require("./models/Messages");

module.exports = {
  Query: {
    messages: async() => { 
      try {
        const getMessages = await Messages.messageCollection.find();
        return getMessages;
      } catch (error) {
        return error;
      }    
    },
  },

  Mutation: {
    createMessage: async(_, {
      user,
      message,
      timestamp
    }) => {
      try {
          const msg = await Messages.messageCollection.create({
            user,
            message,
            timestamp
          })
          pubsub.publish('newMessage', {
            newMessage: msg,
            user
          });
          return msg;
      } catch (error) {
          return error;
      }
    },
  },

  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator('newMessage'),
    },
  },
};
