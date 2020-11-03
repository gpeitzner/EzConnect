const s3 = require("../config/simpleStorageService");
const dynamoDB = require("../config/dynamoDB");

const getUser = async (req, res) => {};

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
    if (exist["Item"]) {
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

const updateUser = async (req, res) => {};

module.exports = { getUser, createUser, updateUser };
