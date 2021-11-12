const app = require("express")();
const getData = require("./helper/getData");
const { Telegraf } = require("telegraf");
const makeMessageStr = require("./helper/makeMessageStr");
const bot = new Telegraf("2142929512:AAGA2jviFY17aUJTuZY_tq5yxVypimDXcZA");
const cron = require("node-cron");

app.get("/", async (req, res) => {
  var data = await getData();

  if (data.length > 0) {
    res.status(200).json({
      message: "Fetched successfully",
      lastAvailableData: data[0],
      previousTwoYearData: data.slice(1, 25),
    });
  } else {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

async function doMessageStuff() {
  try {
    var data = await getData();
    var lastTwoYearData = data.slice(1, 25);
    var messageStr = ``;
    lastTwoYearData.forEach((d) => {
      messageStr += makeMessageStr(d);
    });

    if (data.length > 0) {
      bot.telegram.editMessageText(
        "-1001692621361",
        4,
        undefined,
        `<b>👋 Hello,</b> Welcome to <i>Investment Ready</i>\n\n` +
          `<b>This Month (<i>${
            data[0].buffett.canInvest ? "Can Invest" : "Don't Invest"
          }</i>):</b>\n` +
          `${makeMessageStr(data[0])}\n` +
          `<b>Last Two years:</b>\n` +
          `${messageStr}` +
          `\n\nUpdated at: ${new Date().toUTCString()}`,
        { parse_mode: "HTML" }
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

cron.schedule("0 */6 * * *", async () => {
  doMessageStuff();
});

doMessageStuff();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
