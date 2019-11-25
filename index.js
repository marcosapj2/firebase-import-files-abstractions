const glob = require('glob');
const camelCase = require('camelcase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const settings = { timestampsInSnapshots: true };
const config = functions.config().firebase;

admin.initializeApp(config);
admin.firestore().settings(settings);

const files = glob.sync('./**/*.f.js', { cwd: __dirname, ignore: './node_modules/**' });

for (let f = 0, fl = files.length; f < fl; f++) {
  const file = files[f];
  const extension = ".f.js";
  const functionName = camelCase(file.slice(0, -extension.length).split('/').join('_'));

  if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName) {
    exports[functionName] = require(file);
  }
}