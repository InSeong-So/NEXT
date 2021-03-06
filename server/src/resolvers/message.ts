import { v4 } from 'uuid';
import { writeDB } from '../dbController';
import { DBField, Message, Resolver } from '../types';

const setMessages = (data: Message[]) => writeDB(DBField.MESSAGES, data);

const messageResolver: Resolver = {
  Query: {
    messages: (parent, { cursor = '' }, { db }) => {
      const fromIndex = db.messages.findIndex((msg) => msg.id === cursor) + 1;
      return db.messages?.slice(fromIndex, fromIndex + 15) || [];
    },
    message: (parent, { id = '' }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      if (!userId) throw Error('사용자가 없습니다.');
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMsg);
      setMessages(db.messages);
      return newMsg;
    },
    updateMessage: (parent, { id, text, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw Error('메시지가 없습니다.');
      if (db.messages[targetIndex].userId !== userId) throw Error('사용자가 다릅니다.');

      const newMsg = { ...db.messages[targetIndex], text };
      db.messages.splice(targetIndex, 1, newMsg);
      setMessages(db.messages);
      return newMsg;
    },
    deleteMessage: (parent, { id, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      // eslint-disable-next-line no-throw-literal
      if (targetIndex < 0) throw '메시지가 없습니다.';
      // eslint-disable-next-line no-throw-literal
      if (db.messages[targetIndex].userId !== userId) throw '사용자가 다릅니다.';
      db.messages.splice(targetIndex, 1);
      setMessages(db.messages);
      return id;
    },
  },
  Message: {
    user: (msg, args, { db }) => db.users[msg.userId],
  },
};

export default messageResolver;
