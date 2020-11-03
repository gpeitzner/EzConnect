const s3 = require("../config/simpleStorageService");
const dynamoDB = require("../config/dynamoDB");

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

module.exports = { getUser, createUser, login };
