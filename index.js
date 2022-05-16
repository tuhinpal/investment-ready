const getData = require("./helper/getData");
const { Telegraf } = require("telegraf");
const makeMessageStr = require("./helper/makeMessageStr");
const getConfigs = require("./helper/getConfigs");
const bot = new Telegraf(process.env.BOT_TOKEN);

async function main() {
  try {
    let config = getConfigs();

    var data = await getData();

    if (data.length > 0) {
      await bot.telegram.editMessageText(
        config.CHANNEL_ID,
        config.MESSAGE_ID,
        undefined,
        makeMessageStr(data),
        { parse_mode: "HTML" }
      );
      console.log("Yee! Done 🎉");
    } else {
      throw new Error("No data");
    }
  } catch (error) {
    console.log(error?.message);
  } finally {
    console.log("Exiting...");
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
}

main();
