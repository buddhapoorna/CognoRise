// script.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            const currencyKeys = Object.keys(data.rates);
            const fromCurrency = document.getElementById('from-currency');
            const toCurrency = document.getElementById('to-currency');

            currencyKeys.forEach(currency => {
                const optionFrom = document.createElement('option');
                optionFrom.value = currency;
                optionFrom.textContent = currency;
                fromCurrency.appendChild(optionFrom);

                const optionTo = document.createElement('option');
                optionTo.value = currency;
                optionTo.textContent = currency;
                toCurrency.appendChild(optionTo);
            });

            // Set default values
            fromCurrency.value = 'USD';
            toCurrency.value = 'EUR';
        })
        .catch(error => console.error('Error fetching exchange rates:', error));
});

function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (amount === '' || isNaN(amount)) {
        alert('Please enter a valid amount.');
        return;
    }

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            document.getElementById('conversion-result').textContent = 
                `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        })
        .catch(error => console.error('Error fetching conversion rate:', error));
}
