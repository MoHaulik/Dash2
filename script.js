import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMO42CgBcCfuib0IUwm_COISAbFnXPiBM",
  authDomain: "ctrl-c-ctcl-v.firebaseapp.com",
  databaseURL: "https://ctrl-c-ctcl-v-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ctrl-c-ctcl-v",
  storageBucket: "ctrl-c-ctcl-v.appspot.com",
  messagingSenderId: "73011729368",
  appId: "1:73011729368:web:ee403ad511642e25d6d8ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    const currentDate = document.getElementById('current-date').textContent;
    loadDataForDate(currentDate);

    // Increment function for meal, training, breathing, posts, messages, streak
    window.increment = function(id) {
        const valueElement = document.getElementById(id);
        let currentValue = parseInt(valueElement.textContent.split('/')[0]);
        currentValue++;
        valueElement.textContent = `${currentValue}/${valueElement.textContent.split('/')[1]}`;

        const data = { [id]: currentValue };
        updateData(currentDate, data);
    };

    // Increment function for water
    window.incrementWater = function() {
        const valueElement = document.getElementById('water');
        let currentValue = parseFloat(valueElement.textContent.match(/([\d\.]+) liter/)[1]);
        currentValue += 0.25;
        const percentage = Math.min((currentValue / 2.0) * 100, 100).toFixed(0);
        valueElement.textContent = `${percentage}% (i alt ${currentValue.toFixed(1)} liter)`;

        const progressElement = document.getElementById('water-progress');
        progressElement.textContent = `${percentage}%`;
        document.documentElement.style.setProperty('--progress-percentage', `${percentage}%`);

        const data = { water: currentValue };
        updateData(currentDate, data);
    };

    // Increment function for mindfulness
    window.incrementMinutes = function(id, incrementValue, maxMinutes) {
        const valueElement = document.getElementById(id);
        let currentValue = parseInt(valueElement.textContent.split('/')[0]);
        currentValue += incrementValue;
        if (currentValue > maxMinutes) currentValue = maxMinutes;
        valueElement.textContent = `${currentValue}/${maxMinutes} min`;

        const data = { [id]: currentValue };
        updateData(currentDate, data);
    };

    // Reset all values
    window.resetAll = function() {
        const elements = document.querySelectorAll('.value');
        elements.forEach(element => {
            const text = element.textContent;
            const resetValue = text.includes('/') ? `0/${text.split('/')[1]}` : '0';
            element.textContent = resetValue;
        });

        const data = {
            meal: 0,
            water: 0,
            training: 0,
            mindfulness: 0,
            breathing: 0,
            posts: 0,
            messages: 0,
            streak: 0,
            focus: 0
        };
        updateData(currentDate, data);
    };

    // Toggle focus
    window.toggleFocus = function() {
        const focusElement = document.getElementById('focus');
        const focusDot = document.getElementById('focus-dot');
        let currentValue = parseInt(focusElement.textContent.split('/')[0]);
        currentValue = currentValue === 0 ? 60 : 0; // toggle between 0 and 60 minutes
        focusElement.textContent = `${currentValue}/60 min.`;
        focusDot.classList.toggle('blink', currentValue > 0);

        const data = { focus: currentValue };
        updateData(currentDate, data);
    };

    window.previousDate = function() {
        const currentDateElement = document.getElementById('current-date');
        let currentDate = new Date(currentDateElement.textContent);
        currentDate.setDate(currentDate.getDate() - 1);
        currentDateElement.textContent = currentDate.toLocaleDateString('da-DK');
        loadDataForDate(currentDateElement.textContent);
    };

    window.nextDate = function() {
        const currentDateElement = document.getElementById('current-date');
        let currentDate = new Date(currentDateElement.textContent);
        currentDate.setDate(currentDate.getDate() + 1);
        currentDateElement.textContent = currentDate.toLocaleDateString('da-DK');
        loadDataForDate(currentDateElement.textContent);
    };

    function loadDataForDate(date) {
        readData(date, loadDashboard);
    }

    function updateData(date, data) {
        const dbRef = ref(db, 'dashboard/' + date);
        update(dbRef, data);
    }

    function readData(date, callback) {
        const dbRef = ref(db);
        get(dbRef.child(`dashboard/${date}`)).then((snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    function loadDashboard(data) {
        for (const key in data) {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = key === 'water'
                    ? `${Math.min((data[key] / 2.0) * 100, 100).toFixed(0)}% (i alt ${data[key].toFixed(1)} liter)`
                    : `${data[key]}/${element.textContent.split('/')[1] || '1'}`;
            }
        }
    }
});
