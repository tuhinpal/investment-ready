const axios = require("axios");

async function getData() {
  try {
    const response = (
      await axios.get(
        "https://www.gurufocus.com/global-market-valuation.php?country=IND"
      )
    ).data;

    var gdp = processor(response, "GDP");
    var marketCap = processor(response, "mktcap");

    var finalData = [];

    gdp.forEach((gd) => {
      try {
        let thisMarketCap = marketCap.find(
          (mc) => mc.matchDate === gd.matchDate
        );
        let buffetRatio = getBuffetRatio(thisMarketCap.num, gd.num);
        if (thisMarketCap) {
          finalData.push({
            date: {
              str: gd.dateStr,
              date: gd.date,
            },
            gdp: {
              str: gd.str,
              num: gd.num,
            },
            marketCap: {
              str: thisMarketCap.str,
              num: thisMarketCap.num,
            },
            buffett: {
              ...buffetProcessor(buffetRatio),
              ratio: buffetRatio + " %",
            },
          });
        }
      } catch (_) {}
    });

    // finalData = finalData.slice(0, 24);
    return finalData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

function processor(data, match) {
  var getRaw = [];
  try {
    getRaw =
      data
        .split(`<div id='${match}'>`)[1]
        .split("<script")[1]
        .split("</script>")[0]
        .replace(/ /g, "")
        .split("data:")[1]
        .split("]]")[0] + "]]";

    getRaw = JSON.parse(getRaw);
  } catch (error) {
    console.log(`Data Processor Error: ${error}`);
    getRaw = [];
  }

  var finalOutput = getRaw
    .map((data) => {
      let date = new Date(data[0]);
      return {
        date,
        dateStr: date.toDateString(),
        matchDate: date.getMonth() + 1 + "/" + date.getFullYear(),
        num: data[1],
        str: `${data[1]} Billion INR`,
      };
    })
    .reverse();

  return finalOutput;
}

function buffetProcessor(ratio) {
  if (ratio <= 55) {
    return {
      canInvest: true,
      signal: "green",
      str: "Significantly Undervalued",
      emoji: "💚",
    };
  } else if (ratio > 55 && ratio <= 71) {
    return {
      canInvest: true,
      signal: "green",
      str: "Modestly Undervalued",
      emoji: "💚",
    };
  } else if (ratio > 71 && ratio <= 87) {
    return {
      canInvest: true,
      signal: "yellow",
      str: "Fair Valued",
      emoji: "💛",
    };
  } else if (ratio > 87 && ratio <= 103) {
    return {
      canInvest: false,
      signal: "orange",
      str: "Modestly Overvalued",
      emoji: "💘",
    };
  } else {
    return {
      canInvest: false,
      signal: "red",
      str: "Significantly Overvalued",
      emoji: "💔",
    };
  }
}

function getBuffetRatio(marketCap, gdp) {
  return Math.round((marketCap / gdp) * 100);
}

module.exports = getData;
