require("dotenv").config();

module.exports = function getConfigs() {
  if (!process.env.BOT_TOKEN) {
    throw new Error("Please set BOT_TOKEN");
  }

  if (!process.env.CHANNEL_ID) {
    throw new Error("Please set CHANNEL_ID");
  }

  if (!process.env.MESSAGE_ID) {
    throw new Error("Please set MESSAGE_ID");
  }

  return {
    CHANNEL_ID: process.env.CHANNEL_ID,
    MESSAGE_ID: parseInt(process.env.MESSAGE_ID),
  };
};
