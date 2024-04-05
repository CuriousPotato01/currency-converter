const date = new Date();

let year = date.getFullYear().toString();
let month = ('0' + (date.getMonth() + 1).toString()).slice(-2);
let day = ('0' + date.getDay().toString()).slice(-2);

let formattedDate = `${year}-${month}-${day}`;

baseCurrency = document.querySelector('.top-select');
convertedCurrency = document.querySelector('.bottom-select');

baseCurrency.addEventListener('change', function () {
  updateCurrency();
});

convertedCurrency.addEventListener('change', function () {
  updateCurrency();
});

function updateCurrency() {
  let apiUrl = `https://api.forexrateapi.com/v1/timeframe?api_key=0029779d24003747decec0188a5094e3&start_date=2023-05-01&end_date=${formattedDate}&base=${baseCurrency.value}&currencies=${convertedCurrency.value}`;

  let historicalRate = localStorage.getItem('historicalRate');
  historicalRate = JSON.parse(historicalRate);

  if (
    historicalRate !== null &&
    historicalRate !== undefined &&
    historicalRate !== 'null' &&
    historicalRate !== 'undefined'
  ) {
    historicalRate = JSON.parse(historicalRate);
    console.log(historicalRate);

    let keys = Object.keys(historicalRate.rates);
    let val = [];

    for (let n = 0; n < keys.length; n++) {
      val.push(historicalRate.rates[keys[n]][convertedCurrency.value]);
    }

    const chartData = {
      categories: keys,
      values: val,
    };

    const chartElement = document.querySelector('#chartContainer');
    const chartInstance = echarts.init(chartElement);

    const options = {
      title: {
        text: `${baseCurrency.value}/${convertedCurrency.value}`,
      },
      xAxis: {
        type: 'category',
        data: chartData.categories,
      },
      yAxis: {
        type: 'value',
        min: Math.floor((Math.min(...val) * 9.5) / 10),
        max: Math.ceil((Math.max(...val) * 10.5) / 10),
      },
      series: [
        {
          type: 'line',
          data: chartData.values,
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const dataPoint = params[0];
          const xValue = dataPoint.axisValue;
          const yValue = dataPoint.value;
          return `Date: ${xValue}, Value: ${Math.round(yValue * 100) / 100}`;
        },
      },
    };
    chartInstance.setOption(options);
  } else {
    fetch(apiUrl, {})
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        historicalRate = data;
        console.log(historicalRate);

        let keys = Object.keys(historicalRate.rates);
        let val = [];

        for (let n = 0; n < keys.length; n++) {
          val.push(historicalRate.rates[keys[n]][convertedCurrency.value]);
        }

        const chartData = {
          categories: keys,
          values: val,
        };

        const chartElement = document.querySelector('.chartContainer');
        const chartInstance = echarts.init(chartElement);

        const options = {
          title: {
            text: `${baseCurrency.value}/${convertedCurrency.value}`,
          },
          xAxis: {
            type: 'category',
            data: chartData.categories,
          },
          yAxis: {
            type: 'value',
            min: Math.floor((Math.min(...val) * 9.5) / 10),
            max: Math.ceil((Math.max(...val) * 10.5) / 10),
          },
          series: [
            {
              type: 'line',
              data: chartData.values,
            },
          ],
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              const dataPoint = params[0];
              const xValue = dataPoint.axisValue;
              const yValue = dataPoint.value;
              return `Date: ${xValue}, Value: ${
                Math.round(yValue * 100) / 100
              }`;
            },
          },
        };
        chartInstance.setOption(options);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });

    localStorage.setItem('historicalRate', JSON.stringify(historicalRate));
  }
}
