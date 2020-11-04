const AWS = require("aws-sdk");
const TRANSLATE = new AWS.Translate({
  accessKeyId: "AKIA5M3XKPWM3LDWNR43",
  secretAccessKey: "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",
  region: "us-east-2",
});

function translate(text) {
  return new Promise((resolve, reject) => {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "es-MX",
      Text: text,
    };
    TRANSLATE.translateText(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.TranslatedText);
      }
    });
  });
}

module.exports = { translate };
