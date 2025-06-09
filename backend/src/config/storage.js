const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.DESMAN_OBS_KEY_ID,
  secretAccessKey: process.env.DESMAN_OBS_KEY_SECRET,
  endpoint: process.env.DESMAN_OBS_EXT_URL,
  region: process.env.DESMAN_OBS_REGION,
  signatureVersion: process.env.DESMAN_OBS_SIGNATURE,
});

module.exports = {
  s3,
  bucket: process.env.DESMAN_OBS_BUCKET,
  prefix: process.env.DESMAN_OBS_PREFIX,
};
