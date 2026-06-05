<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://www.mawthiq.loc/api/login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@quest.com',
    'password' => 'password'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
$res = curl_exec($ch);
curl_close($ch);

$data = json_decode($res, true);
if (isset($data['token'])) {
    $token = $data['token'];
    echo "Login Success. Token: " . substr($token, 0, 15) . "...\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://www.mawthiq.loc/api/users");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Accept: application/json'
    ]);
    $res = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "Status Code: $status\n";
    echo "Response: " . substr($res, 0, 500) . "\n";
} else {
    echo "Login Failed: $res\n";
}
