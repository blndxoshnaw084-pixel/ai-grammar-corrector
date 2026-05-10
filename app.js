// app.js

// Grab DOM elements
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const userNameInput = document.getElementById('userNameInput');
const enterAppBtn = document.getElementById('enterAppBtn');
const welcomeMessage = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');

const inputText = document.getElementById('inputText');
const correctBtn = document.getElementById('correctBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultContainer = document.getElementById('resultContainer');
const correctedDisplay = document.getElementById('correctedDisplay');
const errorBox = document.getElementById('errorBox');
const copyBtn = document.getElementById('copyBtn');
const copyText = document.getElementById('copyText');

const historyContainer = document.getElementById('historyContainer');
const emptyHistoryMsg = document.getElementById('emptyHistoryMsg');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

// Helper to get current user's history key
function getUserHistoryKey() {
    const user = localStorage.getItem('grammarAppUser') || 'guest';
    return `grammarAppHistory_${user}`;
}

// --- 1. Login & Auth System (Local) ---
function checkAuth() {
    const user = localStorage.getItem('grammarAppUser');
    if (user) {
        loginScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        welcomeMessage.innerHTML = `Welcome back, <span class="text-blue-600 dark:text-blue-400">${user}</span>! 👋`;
        loadHistory(); // Load history specific to this user
    } else {
        loginScreen.classList.remove('hidden');
        appScreen.classList.add('hidden');
    }
}

enterAppBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    if (name) {
        localStorage.setItem('grammarAppUser', name);
        loginScreen.style.opacity = '0';
        setTimeout(() => checkAuth(), 300);
    } else {
        userNameInput.classList.add('border-red-500', 'ring-red-500');
        setTimeout(() => userNameInput.classList.remove('border-red-500', 'ring-red-500'), 1000);
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('grammarAppUser');
    loginScreen.style.opacity = '1';
    inputText.value = '';
    resultContainer.classList.add('hidden');
    checkAuth();
});

// --- 2. Dark Mode System ---
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('grammarAppTheme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
    if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

const savedTheme = localStorage.getItem('grammarAppTheme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    updateThemeIcons(true);
}
themeToggle.addEventListener('click', toggleTheme);

// --- 3. Grammar Correction Logic ---
correctBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) {
        showError("Please enter some text to correct.");
        return;
    }

    setLoadingState(true);
    errorBox.classList.add('hidden');
    resultContainer.classList.add('hidden');

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        if (data.success) {
            correctedDisplay.textContent = data.corrected;
            resultContainer.classList.remove('hidden');
            saveToHistory(text, data.corrected);
        } else {
            showError(data.error || "An error occurred.");
        }
    } catch (error) {
        showError("Failed to connect to the server.");
    } finally {
        setLoadingState(false);
    }
});

// --- 4. History Management (User Specific) ---
function saveToHistory(original, corrected) {
    const historyKey = getUserHistoryKey();
    let history = JSON.parse(localStorage.getItem(historyKey)) || [];
    
    history.unshift({ original, corrected, time: new Date().toLocaleTimeString() });
    if (history.length > 10) history.pop();
    
    localStorage.setItem(historyKey, JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const historyKey = getUserHistoryKey();
    let history = JSON.parse(localStorage.getItem(historyKey)) || [];
    historyContainer.innerHTML = '';

    if (history.length === 0) {
        emptyHistoryMsg.style.display = 'block';
    } else {
        emptyHistoryMsg.style.display = 'none';
        history.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition cursor-pointer';
            card.innerHTML = `
                <div class="text-xs text-gray-400 mb-1">${item.time}</div>
                <div class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">${item.original}</div>
                <div class="text-sm text-blue-600 dark:text-blue-400 line-clamp-1 mt-1">${item.corrected}</div>
            `;
            card.addEventListener('click', () => {
                inputText.value = item.original;
                correctedDisplay.textContent = item.corrected;
                resultContainer.classList.remove('hidden');
            });
            historyContainer.appendChild(card);
        });
    }
}

clearHistoryBtn.addEventListener('click', () => {
    if(confirm("Are you sure you want to clear your history?")) {
        const historyKey = getUserHistoryKey();
        localStorage.removeItem(historyKey);
        loadHistory();
    }
});

// --- 5. UI Helpers ---
function setLoadingState(isLoading) {
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
        correctBtn.disabled = true;
        correctBtn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        loadingSpinner.classList.add('hidden');
        correctBtn.disabled = false;
        correctBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

clearBtn.addEventListener('click', () => {
    inputText.value = '';
    resultContainer.classList.add('hidden');
    errorBox.classList.add('hidden');
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(correctedDisplay.textContent).then(() => {
        copyText.textContent = 'Copied!';
        copyBtn.classList.add('text-green-500');
        setTimeout(() => {
            copyText.textContent = 'Copy';
            copyBtn.classList.remove('text-green-500');
        }, 2000);
    });
});

// Initialize App
checkAuth();