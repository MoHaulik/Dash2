let meal = 0;
let waterIntake = 0.0;
let training = 0;
let mindfulness = 0;
let breathing = 0;
let posts = 0;
let messages = 0;
let streak = 0;
let focus = 0;
let focusActive = false;

let currentDate = new Date(2024, 7, 30); // Start from 30 August 2024
const endDate = new Date(2024, 8, 30); // End at 30 September 2024
const dataStorage = {};

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('da-DK', options);
}

function updateDateDisplay() {
    document.getElementById('current-date').textContent = formatDate(currentDate);
}

function saveCurrentData() {
    dataStorage[formatDate(currentDate)] = {
        meal,
        waterIntake,
        training,
        mindfulness,
        breathing,
        posts,
        messages,
        streak,
        focus
    };
}

function loadDateData(date) {
    const formattedDate = formatDate(date);
    if (dataStorage[formattedDate]) {
        const data = dataStorage[formattedDate];
        meal = data.meal;
        waterIntake = data.waterIntake;
        training = data.training;
        mindfulness = data.mindfulness;
        breathing = data.breathing;
        posts = data.posts;
        messages = data.messages;
        streak = data.streak;
        focus = data.focus;
    } else {
        resetAll(); // Reset to default if no data exists for the date
    }
    updateDashboard();
}

function updateDashboard() {
    document.getElementById('meal').textContent = `${meal}/3`;
    document.getElementById('water').textContent = `${Math.round((waterIntake / 2.6) * 100)}% (i alt ${waterIntake.toFixed(1)} liter)`;
    document.getElementById('training').textContent = `${training}/1`;
    document.getElementById('mindfulness').textContent = `${mindfulness}/25 min`;
    document.getElementById('breathing').textContent = `${breathing}/3`;
    document.getElementById('posts').textContent = posts;
    document.getElementById('messages').textContent = messages;
    document.getElementById('streak').textContent = streak;
    document.getElementById('focus').textContent = `${focus}/60 min.`;
    document.getElementById('water-progress').textContent = `${Math.round((waterIntake / 2.6) * 100)}%`;

    const progressCircle = document.querySelector('.progress-circle');
    progressCircle.style.setProperty('--progress-percentage', `${Math.round((waterIntake / 2.6) * 100)}%`);
}

function previousDate() {
    saveCurrentData();
    if (currentDate > new Date(2024, 7, 30)) {
        currentDate.setDate(currentDate.getDate() - 1);
        loadDateData(currentDate);
        updateDateDisplay();
    }
}

function nextDate() {
    saveCurrentData();
    if (currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        loadDateData(currentDate);
        updateDateDisplay();
    }
}

function increment(id) {
    const element = document.getElementById(id);
    switch(id) {
        case 'meal':
            meal = Math.min(meal + 1, 3);
            element.textContent = `${meal}/3`;
            break;
        case 'training':
            training = Math.min(training + 1, 1);
            element.textContent = `${training}/1`;
            break;
        case 'mindfulness':
            mindfulness = Math.min(mindfulness + 2, 25);
            element.textContent = `${mindfulness}/25 min`;
            break;
        case 'breathing':
            breathing = Math.min(breathing + 1, 3);
            element.textContent = `${breathing}/3`;
            break;
        case 'posts':
            posts++;
            element.textContent = posts;
            break;
        case 'messages':
            messages++;
            element.textContent = messages;
            break;
        case 'streak':
            streak++;
            element.textContent = streak;
            break;
        default:
            break;
    }
    element.classList.add('update');
    setTimeout(() => element.classList.remove('update'), 500);
}

function incrementWater() {
    waterIntake += 0.25;
    const maxWater = 2.6;
    const percentage = Math.min((waterIntake / maxWater) * 100, 100);
    document.getElementById('water').textContent = `${percentage.toFixed(0)}% (i alt ${waterIntake.toFixed(1)} liter)`;

    // Update the progress bar
    const progressCircle = document.querySelector('.progress-circle');
    progressCircle.style.setProperty('--progress-percentage', `${percentage}%`);
    document.getElementById('water-progress').textContent = `${percentage.toFixed(0)}%`;
}

function incrementMinutes(id, increment, max) {
    const element = document.getElementById(id);
    switch(id) {
        case 'mindfulness':
            mindfulness = Math.min(mindfulness + increment, max);
            element.textContent = `${mindfulness}/${max} min`;
            break;
        default:
            break;
    }
    element.classList.add('update');
    setTimeout(() => element.classList.remove('update'), 500);
}

function toggleFocus() {
    focusActive = !focusActive;
    if (focusActive) {
        focusInterval = setInterval(() => {
            focus = Math.min(focus + 1, 60);
            document.getElementById('focus').textContent = `${focus}/60 min.`;
            if (focus === 60) {
                clearInterval(focusInterval);
                focusActive = false;
            }
        }, 60000);
    } else {
        clearInterval(focusInterval);
    }
    document.getElementById('focus-dot').classList.toggle('blink', focusActive);
}

function resetAll() {
    meal = 0;
    waterIntake = 0.0;
    training = 0;
    mindfulness = 0;
    breathing = 0;
    posts = 0;
    messages = 0;
    streak = 0;
    focus = 0;
    focusActive = false;
    document.getElementById('meal').textContent = '0/3';
    document.getElementById('water').textContent = '0% (i alt 0.0 liter)';
    document.getElementById('training').textContent = '0/1';
    document.getElementById('mindfulness').textContent = '0/25 min';
    document.getElementById('breathing').textContent = '0/3';
    document.getElementById('posts').textContent = '0';
    document.getElementById('messages').textContent = '0';
    document.getElementById('streak').textContent = '0';
    document.getElementById('focus').textContent = '0/60 min.';
    document.getElementById('focus-dot').classList.remove('blink');
}

// Initialize
updateDateDisplay();
loadDateData(currentDate);
