<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://www.mawthiq.loc/api/users");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "OPTIONS");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Origin: http://localhost:3000',
    'Access-Control-Request-Method: GET',
    'Access-Control-Request-Headers: authorization, accept'
]);
$res = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status Code: $status\n";
echo "Response/Headers:\n$res\n";
