const s3 = require("../config/simpleStorageService");
const dynamoDB = require("../config/dynamoDB");
const translate = require("../config/translate");
const rekognition = require("../config/rekognition");

const createPublication = async (req, res) => {
  try {
    const { email, name, avatar, text, friends, photo } = req.body;
    const photoLocation = await s3.uploadImage(photo);
    let photoName = photoLocation.toString().split("/");
    photoName = photoName[photoName.length - 1];
    const tags = await rekognition.getTags(photoName);
    const finalTags = [];
    for (let i = 0; i < tags.Labels.length; i++) {
      const tag = tags.Labels[i];
      const finalTag = await translate.translate(tag.Name);
      finalTags.push(finalTag);
    }
    const finalFriends = [];
    for (let i = 0; i < friends.length; i++) {
      try {
        const friend = friends[i];
        const compare = await rekognition.compareImages(
          photoName,
          friend.photo
        );
        if (compare !== 0) {
          if (compare.Similarity > 90) {
            finalFriends.push(friend.name);
          }
        }
      } catch (error) {}
    }
    const item = {
      PublishId: { N: Date.now().toString() },
      email: { S: email },
      name: { S: name },
      avatar: { S: avatar },
      text: { S: text },
      photo: { S: photoLocation },
    };
    if (finalTags.length > 0) {
      item.tags = { SS: finalTags };
    }
    if (finalFriends.length > 0) {
      item.friends = { SS: finalFriends };
    }
    const params = {
      TableName: "ezconnectgt-publish",
      Item: item,
    };
    await dynamoDB.insert(params);
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad publish data" });
  }
};

const getAllPublications = async (req, res) => {
  try {
    const params = {
      TableName: "ezconnectgt-publish",
    };
    const results = await dynamoDB.getAll(params);
    res.json(
      results.Items.map((publication) => {
        return {
          email: publication.email.S,
          name: publication.name.S,
          avatar: publication.avatar.S,
          text: publication.text.S,
          photo: publication.photo.S,
          tags: publication.tags ? publication.tags.SS : [],
          friends: publication.friends ? publication.friends.SS : [],
        };
      })
    );
  } catch (error) {
    res.status(400).json({ message: "Error getting publications data" });
  }
};

module.exports = { createPublication, getAllPublications };
