const tf = require('@tensorflow/tfjs'); // tfjs for browser-compatible usage
const fs = require('fs');
const path = require('path');

// 🔧 Utility to read all samples from a folder
function readSamplesFromFolder(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
  const allSamples = [];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(folderPath, file), 'utf-8'));
    if (Array.isArray(data[0])) {
      // Support multi-sample file
      allSamples.push(...data);
    } else {
      // Single sample
      allSamples.push(data);
    }
  }

  return allSamples;
}

// ✅ Load all samples from two folders
const realFolder = path.join(__dirname, '../samples/real');
const fakeFolder = path.join(__dirname, '../samples/fake');

const realData = readSamplesFromFolder(realFolder);
const fakeData = readSamplesFromFolder(fakeFolder);

// ✅ Check
if (realData.length < 1 || fakeData.length < 1) {
  throw new Error('Insufficient real or fake samples!');
}
if (realData[0].length !== fakeData[0].length) {
  throw new Error('Feature dimension mismatch between real and fake samples!');
}

// ✅ Convert to tensors
const realX = tf.tensor2d(realData);
const fakeX = tf.tensor2d(fakeData);
const realY = tf.tensor2d(realData.map(() => [1]));
const fakeY = tf.tensor2d(fakeData.map(() => [0]));

// ✅ Combine
const xs = tf.concat([realX, fakeX]);
const ys = tf.concat([realY, fakeY]);

// ✅ Define model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [realData[0].length], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

model.compile({
  loss: 'binaryCrossentropy',
  optimizer: 'adam',
  metrics: ['accuracy'],
});

// ✅ Train
(async () => {
  await model.fit(xs, ys, {
    epochs: 50,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) =>
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)} acc = ${logs.acc?.toFixed(4)}`)
    }
  });

  console.log('✅ Training complete');
})();
