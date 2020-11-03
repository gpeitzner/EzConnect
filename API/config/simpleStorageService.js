const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  accessKeyId: "AKIA5M3XKPWM3LDWNR43",
  secretAccessKey: "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",
});

function uploadImage(buffer64) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(buffer64, "base64");
    const imagePath = Date.now() + ".png";
    const params = {
      Bucket: "ezconnectgt",
      Key: imagePath,
      Body: buffer,
      ACL: "public-read",
    };
    S3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}

module.exports = uploadImage;
