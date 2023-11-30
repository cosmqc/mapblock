<?php

echo $_GET['id'];

require __DIR__ . '\..\vendor\autoload.php';

// Use the UploadApi class for uploading assets
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

// Configure an instance of your Cloudinary cloud
Configuration::instance('cloudinary://772938615632749:9kBMvbix9VaA4CnRSgTSHpeTAK8@dp5ikbuvw?secure=true');

// Upload the image
$upload = new UploadApi();
echo '<pre>';
echo json_encode(
    $upload->upload('C:\Users\snake\Pictures\cope.png', [
        'public_id' => 'cope',
        'use_filename' => FALSE,
        'overwrite' => FALSE,
        'folder' => $_GET['id'],
    ]),
    JSON_PRETTY_PRINT
);
echo '</pre>';
?>