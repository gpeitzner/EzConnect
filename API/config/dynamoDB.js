const { DynamoDB } = require("aws-sdk");
const AWS = require("aws-sdk");
const DDB = new AWS.DynamoDB({
  accessKeyId: "AKIA5M3XKPWM3LDWNR43",
  secretAccessKey: "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",
  region: "us-east-2",
});

function insert(params) {
  return new Promise((resolve, reject) => {
    DDB.putItem(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function get(params) {
  return new Promise((resolve, reject) => {
    DDB.getItem(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function getAll(params) {
  return new Promise((resolve, reject) => {
    DDB.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = { insert, get, getAll };
