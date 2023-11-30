<?php

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit;
}

require_once '../secrets.php';

$content = json_decode(file_get_contents('php://input'), true);
$memory = $content['memory'];
$block = $content['block'];
$text = $content['text'];

// Setup MySQL connection
$conn = new PDO('mysql:dbname=mapblock;host=localhost;charset=utf8mb4', $dbuser, $dbpass);
$conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (is_null($memory)) {
    // need to create a new memory and return the memory id
    $stmt = $conn->prepare('INSERT INTO memory (block, text) VALUES (:block, :text)');
    $stmt->execute(['block' => $block, 'text' => $text ]);
    
    $stmt = $conn->query("SELECT LAST_INSERT_ID()");
    $memory = $stmt->fetch()['LAST_INSERT_ID()'];
} else {
    // otherwise, just update the memory with the user's input
    $stmt = $conn->prepare('UPDATE memory SET text = :text WHERE id = :memory');
    $stmt->execute(['text' => $text, 'memory' => $memory ]);
}

echo $memory;