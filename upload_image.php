<?php
require_once '../secrets.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit;
}

$content = json_decode(file_get_contents('php://input'), true);
$memory = $content['memory'];
$url = $content['url'];


$conn = new PDO('mysql:dbname=mapblock;host=localhost;charset=utf8mb4', $dbuser, $dbpass);
$conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $conn->prepare('INSERT INTO image (memory, url) VALUES (:id, :url)');
$resp = $stmt->execute([ 
    'id' => $memory,
    'url' => $url
 ]);