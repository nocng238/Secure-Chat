const { StatusCodes } = require("http-status-codes");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { BadRequestError } = require("../errors/bad-request");

var that = (module.exports = {
  getChat: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "No User Exists!" });
    }

    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "username avatar email fullName _id",
    });

    if (chat.length > 0) {
      res.send(chat[0]);
    } else {
      const createChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.id, userId],
      });

      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      res.status(StatusCodes.OK).json(fullChat);
    }
  },
  getChats: async (req, res) => {
    const chat = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const user = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "username avatar email fullName _id",
    });

    res.status(StatusCodes.OK).json(user);
  },
  createGroup: async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).json({
        message: "More than 2 users are required to form a group chat",
      });
    }

    users.push(req.user.id);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  },
  renameGroup: async (req, res) => {
    const { chatId, chatName } = req.body;

    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updateChat) {
      throw new BadRequestError("Chat Not Found");
    } else {
      res.status(StatusCodes.OK).json(updateChat);
    }
  },
  addUserToGroup: async (req, res) => {
    const { chatId, userId } = req.body;

    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!addUser) {
      throw new BadRequestError("Chat Not Found");
    } else {
      res.status(StatusCodes.OK).json(addUser);
    }
  },
  removeFromGroup: async (req, res) => {
    const { chatId, userId } = req.body;

    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removeUser) {
      throw new BadRequestError("Chat Not Found");
    } else {
      res.status(StatusCodes.OK).json(removeUser);
    }
  },
});
