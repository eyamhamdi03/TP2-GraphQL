export const Subscription = {
  cvChanged: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('cvChanged');
    }
  }
};
