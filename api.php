<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$inputText = $data['text'] ?? '';

if (empty($inputText)) {
    echo json_encode(['error' => 'No text provided']);
    exit;
}

// ⚠️ Insert your key here for local use, but remove before GitHub upload
$apiKey = 'YOUR_API_KEY_HERE';
$apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

$payload = [
    "model" => "llama-3.1-8b-instant",
    "messages" => [
        ["role" => "system", "content" => "Correct the grammar and spelling. Return ONLY corrected text."],
        ["role" => "user", "content" => $inputText]
    ],
    "temperature" => 0.3
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $apiKey]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $res = json_decode($response, true);
    echo json_encode(['success' => true, 'corrected' => $res['choices'][0]['message']['content']]);
} else {
    echo json_encode(['error' => 'API Error']);
}