<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="resources/css/memory.css">
    <script async src="https://js.stripe.com/v3/buy-button.js"></script>
</head>

<body>
    <div class="header">
        Do you want to share any memories of this place with us?<br><br>
        <div class="tagline">
        By sharing, you give The Kind Foundation permission to use the text and images.
        </div>
    </div>
    
    <div class="userinput">
        <textarea id="textinput" name="textinput"></textarea><br>
        <button id="upload_widget" class="cloudinary-button">Upload files</button>
    </div>

    <div class='checkout-button'>
        Donate
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
    <script src="resources/js/memory.js" type="text/javascript"></script>
</body>

</html>