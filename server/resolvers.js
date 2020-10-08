const { 
  PubSub, 
  GraphQLServer,
  withFilter  
} = require("graphql-yoga");

const pubsub = new PubSub();
const Messages = require("./models/Messages");
const notifications = [];

module.exports = {
  Query: {
    notifications: () => notifications, 
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

    pushNotification: (root, args) => {
      const newNotification = { label: args.label };
      notifications.push(newNotification);

      pubsub.publish('newNotification', {
        newNotification: newNotification
      });
      return newNotification;
    },
  },

  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator('newMessage'),
    },

    newNotification: {
      subscribe: () => pubsub.asyncIterator('newNotification')
    }
  },
};
