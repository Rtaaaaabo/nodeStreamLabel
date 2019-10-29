"use strict";

async function main(path = "LOCAL_PATH") {
  const {
    StreamingVideoIntelligenceServiceClient
  } = require("@google-cloud/video-intelligence").v1p3beta1;
  const fs = require("fs");

  const client = new StreamingVideoIntelligenceServiceClient();

  const configRequest = {
    videoConfig: {
      feature: "STREAMING_LABEL_DETECTION"
    }
  };
  const readStream = fs.createReadStream(path, {
    highWaterMark: 5 * 1024 * 1024,
    encoding: "base64"
  });
}
