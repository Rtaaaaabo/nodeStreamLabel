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

  const chunks = [];
  readStream
    .on("data", chunk => {
      const request = {
        inputContent: chunk.toString()
      };
      chunks.push(request);
    })
    .on("close", function() {
      stream.write(configRequest);
      for (let i = 0; i < chunks.length; i++) {
        stream.write(chunks[i]);
      }
      stream.end();
    });

  const stream = client.streamingAnnotateVideo().on("data", response => {
    const annotations = response.annotationResults;
    const labels = annotations.labelAnnotations;
    labels.forEach(label => {
      console.log(
        `Label ${label.entity.description} occurs at: ${label.frames[0]
          .timeOffset.seconds || 0}` +
          `.${(label.frames[0].timeOffset.nanos / 1e6).toFixed(0)}s`
      );
      console.log(`Confidence: ${labels.frames[0].confidence}`);
    });
  });
}

main(...process.argv.slice(2)).catch(console.error());
