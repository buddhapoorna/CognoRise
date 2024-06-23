// script.js
let countdownInterval;

function startCountdown() {
    clearInterval(countdownInterval);

    const dateElement = document.getElementById('date-picker');
    const timeElement = document.getElementById('time-picker');

    const date = dateElement.value;
    const time = timeElement.value;

    if (!date || !time) {
        alert('Please select both date and time.');
        return;
    }

    const targetDateTime = new Date(`${date}T${time}`);

    if (isNaN(targetDateTime.getTime())) {
        alert('Please select a valid date and time.');
        return;
    }

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDateTime - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = 'Countdown Ended';
            document.getElementById('countdown-container').classList.add('ended');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }, 1000);
}
