// app.js

// Grab DOM elements
const inputText = document.getElementById('inputText');
const correctBtn = document.getElementById('correctBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultContainer = document.getElementById('resultContainer');
const originalDisplay = document.getElementById('originalDisplay');
const correctedDisplay = document.getElementById('correctedDisplay');
const errorBox = document.getElementById('errorBox');
const copyBtn = document.getElementById('copyBtn');

// Handle the main action
correctBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    
    if (!text) {
        showError("Please enter some text to correct.");
        return;
    }

    // Step 4: Show loading state
    setLoadingState(true);
    errorBox.classList.add('hidden');
    resultContainer.classList.add('hidden');

    try {
        // Step 3: Send request to our PHP backend proxy
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        // Step 5: Receive response and display it
        if (data.success) {
            originalDisplay.textContent = text;
            correctedDisplay.textContent = data.corrected;
            resultContainer.classList.remove('hidden');
        } else {
            showError(data.error || "An error occurred.");
        }
    } catch (error) {
        showError("Failed to connect to the server. Please ensure Laragon is running.");
    } finally {
        setLoadingState(false);
    }
});

// Helper: Toggle UI loading state
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

// Helper: Show error messages
function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

// Bonus Feature: Clear Input
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    resultContainer.classList.add('hidden');
    errorBox.classList.add('hidden');
});

// Bonus Feature: Copy Result
copyBtn.addEventListener('click', () => {
    const textToCopy = correctedDisplay.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Brief visual feedback
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>';
        setTimeout(() => {
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>';
        }, 2000);
    });
});