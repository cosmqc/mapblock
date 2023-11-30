const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let memoryid;

function saveUrlToDatabase(memory, url) {
    $.ajax({
        type: "POST",
        url: "../../upload_image.php",
        data: JSON.stringify({
            memory: memory,
            url: url,
        }),
        contentType: "application/json",
        success: function(result) {
            console.log(`URL saved: ${url}`);
        },
        error: function(result) {
            console.error(`Error saving url to db. Received: ${result}`);
        }
    });
}

function saveTextToDatabase(memory, block, text) {
    $.ajax({
        type: "POST",
        url: "../../upload.php",
        data: JSON.stringify({
            memory: memory,
            block: block,
            text: text,
        }),
        contentType: "application/json",
        success: function(result) {
            memoryid = result;
            console.log(`Memory successfully saved at id ${memoryid}`)
        },
        error: function(result) {
            console.error(`Error saving memory to db. Received: ${result}`);
        }
    });
}

let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dp5ikbuvw',
    uploadPreset: 'unsigned'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        console.log(result.info.url);
        saveUrlToDatabase(memoryid, result.info.url);
    } else if (error) {
        console.error(`Error uploading image to cloudinary. Received: ${error}`)
        console.error(result);
    }
})

document.getElementById("upload_widget").addEventListener("click", function() {
    myWidget.open();
}, false);

$('.checkout-button').on('click', function(event) {
    event.preventDefault();
    let userText = $('#textinput').val();
    if (urlParams.get('id') != false) {
        if (userText.trim() != '') {
            saveTextToDatabase(memoryid, urlParams.get('id'), userText);
        }
        // create checkout session
        $.ajax({
            type: "POST",
            url: "../../checkout.php",
            data: JSON.stringify({
                id: urlParams.get('id'),
            }),
            contentType: "application/json",
            success: function(result) {
                window.location.href = result;
            },
            error: function(result) {
                alert('An error occured, please try again');
                console.log(`Error talking w Stripe. Received URL: ${result}`);
            }
        });
    }
})

// creates a session of sorts, meaning we can tie a memory id to all images uploaded
$(window).on('load', function() {
    saveTextToDatabase(null, urlParams.get('id'), "");
})