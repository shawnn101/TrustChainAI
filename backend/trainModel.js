const tf = require('@tensorflow/tfjs'); // NOT tfjs-node
const fs = require('fs');
const path = require('path');

// ✅ Load real/fake data from JSON files
const realData = JSON.parse(fs.readFileSync(path.join(__dirname, '../samples/real.json')));
const fakeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../samples/fake.json')));

// ✅ Convert to tensors
const realX = tf.tensor2d(realData);
const fakeX = tf.tensor2d(fakeData);
const realY = tf.tensor2d(realData.map(() => [1])); // real = 1
const fakeY = tf.tensor2d(fakeData.map(() => [0])); // fake = 0

// Combine
const xs = tf.concat([fakeX, realX]);
const ys = tf.concat([fakeY, realY]);

// Define model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

model.compile({
  loss: 'binaryCrossentropy',
  optimizer: 'adam',
  metrics: ['accuracy']
});

// ✅ Custom save function (unchanged)
async function saveModelJSON(model, saveDir = './public/models') {
  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
  const modelJSON = await model.toJSON();
  fs.writeFileSync(path.join(saveDir, 'model.json'), JSON.stringify(modelJSON));
  console.log(`✅ Model saved manually to ${path.resolve(saveDir)}`);
}

// Train and save
(async () => {
  await model.fit(xs, ys, {
    epochs: 50,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`)
    }
  });

  await saveModelJSON(model);
})();

