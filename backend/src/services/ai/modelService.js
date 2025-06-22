const tf = require("@tensorflow/tfjs-node");
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
    const tensor = preprocessImage(buffer);
    images.push(tensor);
    labels.push(1);
  }

  for (const file of fakeFiles) {
    const buffer = fs.readFileSync(path.join(fakeDir, file));
    const tensor = preprocessImage(buffer);
    images.push(tensor);
    labels.push(0);
  }

  return {
    xs: tf.stack(images),
    ys: tf.tensor2d(labels, [labels.length, 1])
  };
}

function preprocessImage(buffer) {
  return tf.node.decodeImage(buffer, 1)
    .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE])
    .toFloat()
    .div(tf.scalar(255.0));
}

async function trainModel() {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_SIZE, IMAGE_SIZE, 1],
    filters: 16,
    kernelSize: 3,
    activation: "relu",
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] });

  const data = await loadImagesFromFolders("server/ai/data");
  await model.fit(data.xs, data.ys, {
    epochs: 10,
    shuffle: true,
    callbacks: { onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss=${logs.loss}`) },
  });

  await model.save("file://server/ai/model");
  console.log("Model trained and saved.");
}

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel("file://server/ai/model/model.json");
  }
  return model;
}

async function predictFraud(model, imageBuffer) {
  const tensor = preprocessImage(imageBuffer).expandDims();
  const prediction = model.predict(tensor);
  const value = (await prediction.data())[0];
  return parseFloat(value.toFixed(2));
}

module.exports = {
  trainModel,
  loadModel,
  predictFraud,
};
