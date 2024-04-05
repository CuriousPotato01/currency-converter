const apiUrl =
  'https://api.currencyapi.com/v3/latest?apikey=fca_live_o11BDc1YozMxyr4prwRcuqm4uukWlKCS4YGGMYxe';

let currencyData = localStorage.getItem('currencyData');

if (currencyData) {
  currencyData = JSON.parse(currencyData);
  console.log(currencyData.data);
} else {
  fetch(apiUrl, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      currencyData = data;
      console.log(currencyData);
      localStorage.setItem('currencyData', JSON.stringify(currencyData));
    })
    .catch((error) => {
      console.error('Fetch error:', error);
    });
}

const topInput = document.querySelector('.top-input');
const bottomInput = document.querySelector('.bottom-input');

const topDrop = document.querySelector('.top-select');
const bottomDrop = document.querySelector('.bottom-select');

const input = document.querySelector('.input');
const output = document.querySelector('.output');

let topText = topDrop.options[topDrop.selectedIndex].text;
let bottomText = bottomDrop.options[bottomDrop.selectedIndex].text;

function updateOutput() {
  let topText = topDrop.options[topDrop.selectedIndex].text;
  let bottomText = bottomDrop.options[bottomDrop.selectedIndex].text;
  let topValue = topDrop.value;
  let bottomValue = bottomDrop.value;

  let exchangeRate =
    currencyData.data[bottomValue].value / currencyData.data[topValue].value;
  bottomInput.value = (topInput.value * exchangeRate).toFixed(2);
  input.innerHTML = topInput.value + ' ' + topText + ' eşittir';
  output.innerHTML = bottomInput.value + ' ' + bottomText;
}

function updateOutputa() {
  let topText = topDrop.options[topDrop.selectedIndex].text;
  let bottomText = bottomDrop.options[bottomDrop.selectedIndex].text;
  let topValue = topDrop.value;
  let bottomValue = bottomDrop.value;
  let exchangeRate =
    currencyData.data[bottomValue].value / currencyData.data[topValue].value;
  topInput.value = (bottomInput.value * (1 / exchangeRate)).toFixed(2);
  input.innerHTML = topInput.value + ' ' + topText + ' eşittir';
  output.innerHTML = bottomInput.value + ' ' + bottomText;
}

topInput.addEventListener('input', updateOutput);
bottomInput.addEventListener('input', updateOutputa);

topDrop.addEventListener('change', updateOutput);
bottomDrop.addEventListener('change', updateOutput);
