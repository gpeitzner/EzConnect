const s3 = require("../config/simpleStorageService");
const dynamoDB = require("../config/dynamoDB");
const { DynamoDB } = require("aws-sdk");

const getUser = async (req, res) => {
  const email = req.params.email;
  try {
    const params = {
      Key: {
        email: {
          S: email,
        },
      },
      TableName: "ezconnectgt-users",
    };
    const user = await dynamoDB.get(params);
    if (user.Item) {
      res.json({
        email: email,
        name: user.Item.name.S,
        password: user.Item.password.S,
        photo: user.Item.photo.S,
        friends: user.Item.friends ? user.Item.friends.SS : [],
        invitations: user.Item.invitations ? user.Item.invitations.SS : [],
      });
    } else {
      res.status(400).json({ message: "Bad email" });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad email" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, photo } = req.body;
    const searchParams = {
      Key: {
        email: {
          S: email,
        },
      },
      TableName: "ezconnectgt-users",
    };
    const exist = await dynamoDB.get(searchParams);
    if (exist.Item) {
      res.status(400).json({ message: "Bad user data" });
    } else {
      const photoLocation = await s3.uploadImage(photo);
      const params = {
        TableName: "ezconnectgt-users",
        Item: {
          email: { S: email },
          name: { S: name },
          password: { S: password },
          photo: { S: photoLocation },
        },
      };
      await dynamoDB.insert(params);
      res.json({
        email: email,
        name: name,
        password: password,
        photo: photoLocation,
        friends: [],
        invitations: [],
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad user data" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const params = {
      Key: {
        email: { S: email },
      },
      TableName: "ezconnectgt-users",
    };
    const user = await dynamoDB.get(params);
    if (user.Item.password.S === password) {
      res.json({
        email: email,
        name: user.Item.name.S,
        password: password,
        photo: user.Item.photo.S,
        friends: user.Item.friends ? user.Item.friends.SS : [],
        invitations: user.Item.invitations ? user.Item.invitations.SS : [],
      });
    } else {
      res.status(400).json({ message: "Bad credentials" });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad credentials" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, name, password, photo, friends, invitations } = req.body;
    let item = {
      email: { S: email },
      name: { S: name },
      password: { S: password },
      photo: { S: photo },
    };
    if (friends.length > 0) {
      item.friends = { SS: friends };
    }
    if (invitations.length > 0) {
      item.invitations = { SS: invitations };
    }
    const params = {
      TableName: "ezconnectgt-users",
      Item: item,
    };
    await dynamoDB.insert(params);
    res.json({
      email: email,
      name: name,
      password: password,
      photo: photo,
      friends: friends,
      invitations: invitations,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad user data" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const params = {
      TableName: "ezconnectgt-users",
    };
    const results = await dynamoDB.getAll(params);
    res.json(
      results.Items.map((user) => {
        return {
          email: user.email.S,
          name: user.name.S,
          password: user.password.S,
          photo: user.photo.S,
          friends: user.friends ? user.friends.SS : [],
          invitations: user.invitations ? user.invitations.SS : [],
        };
      })
    );
  } catch (error) {
    res.status(400).json({ message: "Error getting users data" });
  }
};

module.exports = { getUser, createUser, login, updateUser, getAllUsers };
