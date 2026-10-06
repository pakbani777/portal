const serverless = require('serverless-http');
const app = require('../server/index');

module.exports.handler = async (event, context) => {
  if (event.path && event.path.startsWith('/.netlify/functions/api')) {
    event.path = event.path.replace('/.netlify/functions/api', '/api');
  }
  const handler = serverless(app);
  return await handler(event, context);
};
