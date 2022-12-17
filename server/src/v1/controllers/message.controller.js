const { StatusCodes } = require('http-status-codes');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const { BadRequestError } = require('../errors/bad-request');

var that = (module.exports = {
  sendMessage: async (req, res) => {
    const { message, chatId } = req.body;

    if (!message || !chatId) {
      return BadRequestError('Please Provide All Fields To send Message');
    }

    let newMessage = {
      sender: req.user.id,
      message: message,
      chat: chatId,
    };

    let m = await Message.create(newMessage);

    m = await m.populate('sender', 'username avatar');
    m = await m.populate('chat');
    m = await User.populate(m, {
      path: 'chat.users',
      select: 'username avatar email _id',
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: m }, { new: true });

    res.status(StatusCodes.OK).json(m);
  },
  allMessages: async (req, res) => {
    const { chatId } = req.params;
    const getMessage = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar email _id')
      .populate('chat');

    res.status(StatusCodes.OK).json(getMessage);
  },
});
