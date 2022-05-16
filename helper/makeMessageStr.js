module.exports = function makeMessageStr(data) {
  var lastTwoYearData = data.slice(1, 25);
  var messageStr = ``;
  lastTwoYearData.forEach((d) => {
    messageStr += singleData(d);
  });

  // looks like react no? 😉
  return (
    `<b>👋 Hello,</b> Welcome to <i>Investment Ready</i>\n\n` +
    `<b>This Month (<i>${
      data[0].buffett.canInvest ? "Can Invest" : "Don't Invest"
    }</i>):</b>\n` +
    `${singleData(data[0])}\n` +
    `<b>Last Two years:</b>\n` +
    `${messageStr}` +
    `\n\nUpdated at: ${new Date().toUTCString()}`
  );
};

function singleData(data) {
  let date = new Date(data.date.date);

  let dateStr =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  return `${data.buffett.emoji} ${dateStr} - ${data.buffett.ratio} - ${data.buffett.str}\n`;
}
