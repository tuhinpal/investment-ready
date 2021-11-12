module.exports = (data) => {
  let date = new Date(data.date.date);

  let dateStr =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  return `${data.buffett.emoji} ${dateStr} - ${data.buffett.ratio} - ${data.buffett.str}\n`;
};
