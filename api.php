<?php
// api.php
header('Content-Type: application/json');

// وەرگرتنی تێکستەکە لە بەشی پێشەوە
$data = json_decode(file_get_contents('php://input'), true);
$inputText = $data['text'] ?? '';

if (empty($inputText)) {
    echo json_encode(['error' => 'Please enter some text.']);
    exit;
}

// ⚠️ تێبینی: کلیلەکە سڕاوەتەوە بۆ پاراستنی ئاسایش لە گیتھەب
$apiKey = 'YOUR_API_KEY_HERE'; 

// لینکی خزمەتگوزاری Groq
$apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

// داواکارییەکە بە بەکارهێنانی مۆدێلێکی خێرا و خۆڕایی
$payload = [
    "model" => "llama-3.1-8b-instant", 
    "messages" => [
        [
            "role" => "system", 
            "content" => "You are an expert editor. Correct the grammar, punctuation, and spelling of the following text. Return ONLY the corrected text, without any explanations or extra words."
        ],
        [
            "role" => "user", 
            "content" => $inputText
        ]
    ],
    "temperature" => 0.3
];

// ناردنی داواکارییەکە
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// گەڕاندنەوەی وەڵامەکە
if ($httpCode === 200) {
    $responseData = json_decode($response, true);
    $correctedText = $responseData['choices'][0]['message']['content'];
    echo json_encode(['success' => true, 'corrected' => $correctedText]);
} else {
    // پیشاندانی هەڵە ئەگەر کێشەیەک هەبێت
    $errorData = json_decode($response, true);
    $specificError = $errorData['error']['message'] ?? 'Failed to connect to the Groq API.';
    echo json_encode(['error' => 'API Error: ' . $specificError]);
}
?>