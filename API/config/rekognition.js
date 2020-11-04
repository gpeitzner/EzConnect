const AWS = require("aws-sdk");
const RKG = new AWS.Rekognition({
  accessKeyId: "AKIA5M3XKPWM3LDWNR43",
  secretAccessKey: "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",
  region: "us-east-2",
});

function getTags(image) {
  return new Promise((resolve, reject) => {
    const params = {
      Image: {
        S3Object: {
          Bucket: "ezconnectgt",
          Name: image,
        },
      },
      MaxLabels: 5,
      MinConfidence: 90,
    };
    RKG.detectLabels(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function compareImages(first, second) {
  return new Promise((resolve, reject) => {
    const params = {
      SimilarityThreshold: 90,
      SourceImage: {
        S3Object: {
          Bucket: "ezconnectgt",
          Name: first,
        },
      },
      TargetImage: {
        S3Object: {
          Bucket: "ezconnectgt",
          Name: second,
        },
      },
    };
    RKG.compareFaces(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.FaceMatches) {
          resolve(1);
        } else {
          resolve(0);
        }
      }
    });
  });
}

module.exports = { getTags, compareImages };
