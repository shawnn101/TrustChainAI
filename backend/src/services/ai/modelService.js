const tf = require("@tensorflow/tfjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMAGE_SIZE = 64;
let model;

async function loadImagesFromFolders(baseDir) {
  const realDir = path.join(baseDir, "real");
  const fakeDir = path.join(baseDir, "fake");
  const realFiles = fs.readdirSync(realDir);
  const fakeFiles = fs.readdirSync(fakeDir);

  const images = [];
  const labels = [];

  for (const file of realFiles) {
    const buffer = fs.readFileSync(path.join(realDir, file));
    const tensor = await preprocessImage(buffer);
    images.push(tensor);
    labels.push(1);
  }

  for (const file of fakeFiles) {
    const buffer = fs.readFileSync(path.join(fakeDir, file));
    const tensor = await preprocessImage(buffer);
    images.push(tensor);
    labels.push(0);
  }

  return {
    xs: tf.stack(images),
    ys: tf.tensor2d(labels, [labels.length, 1]),
  };
}

async function preprocessImage(buffer) {
  const raw = await sharp(buffer)
    .resize(IMAGE_SIZE, IMAGE_SIZE)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = raw;
  const tensor = tf.tensor(new Uint8Array(data), [info.height, info.width, 1]);
  return tensor.toFloat().div(tf.scalar(255.0));
}

async function trainModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_SIZE, IMAGE_SIZE, 1],
      filters: 16,
      kernelSize: 3,
      activation: "relu",
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] });

  const data = await loadImagesFromFolders("server/ai/data");

  await model.fit(data.xs, data.ys, {
    epochs: 10,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss=${logs.loss}`),
    },
  });

  await model.save("downloads://model"); // saves to browser by default in tfjs
  console.log("Model trained and saved.");
}

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel("file://server/ai/model/model.json");
  }
  return model;
}

async function predictFraud(model, imageBuffer) {
  const tensor = (await preprocessImage(imageBuffer)).expandDims();
  const prediction = model.predict(tensor);
  const value = (await prediction.data())[0];
  return parseFloat(value.toFixed(2));
}

module.exports = {
  trainModel,
  loadModel,
  predictFraud,
};
