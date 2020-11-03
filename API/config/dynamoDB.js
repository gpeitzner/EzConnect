const AWS = require("aws-sdk");
const DDB = AWS.DynamoDB({
  accessKeyId: "AKIA5M3XKPWM3LDWNR43",
  secretAccessKey: "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",
});

module.exports = DDB;
