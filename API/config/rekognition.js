const AWS = require("aws-sdk");
const RKG = AWS.Rekognition({
  accessKeyId: "AKIA5M3XKPWM3LDWNR43",
  secretAccessKey: "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",
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
      MaxLabels: 123,
      MinConfidence: 85,
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
        resolve(data.FaceMatches.length);
      }
    });
  });
}

module.exports = { getTags, compareImages };
