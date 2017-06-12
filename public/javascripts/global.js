// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
//$(document).ready(function() {
//
//    // Populate the user table on initial page load
//    populateTable();
//
//});

$(initialize());

function initialize() {
    populateTable();

    $("#userList table tbody").on("click", "td a.linkshowuser", showUserInfo);
    $("#userList table tbody").on("click", "td a.linkdeleteuser", deleteUser);
    $("#btnAddUser").on("click", addUser);
}

// Functions =============================================================

// Fill table with data
function populateTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            // username link click
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
}

function showUserInfo(event) {
    // Prevent link from firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get index of object based on username value
    var arrayPosition = userListData.map(function(arrayItem) {
        return arrayItem.username
    }).indexOf(thisUserName);

    // Get our user object
    var thisUserObject = userListData[arrayPosition];

    // Populate info box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
}

// Add user
function addUser(event) {
    event.preventDefault();

    // Basic validation code... make sure all fields have values
    var errorCount = 0;
    $('#addUser input').each(function(index, val){
        if ($(this).val() === "") {
            errorCount++;
        }
    });

    // If there are no errors
    if (errorCount === 0) {
        // Build a user object from the form input
        var newUser = {
            "username"  :   $("#addUser fieldset input#inputUserName").val(),
            "email"     :   $("#addUser fieldset input#inputUserEmail").val(),
            "fullname"  :   $("#addUser fieldset input#inputUserFullName").val(),
            "age"       :   $("#addUser fieldset input#inputUserAge").val(),
            "location"  :   $("#addUser fieldset input#inputUserLocation").val(),
            "gender"    :   $("#addUser fieldset input#inputUserGender").val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type        : "POST",
            data        : newUser,
            url         : "/users/adduser",
            dataType    : "JSON"
        }).done(function(response) {
            // Check for successful (blank) response
            if (response.msg === "") {
                // Clear the form inputs
                $("#addUser fieldset input").val("");

                // Update the table
                populateTable();
            } else {
                // Something went wrong, alert the error message we received
                alert("Error: " + response.msg);
            }
        })
    } else {
        // If some field had an error, then respond with an error
        alert("Please fill in all fields");
        return false;
    }
}

// Delete User
function deleteUser(event) {
    event.preventDefault();

    // Retrieve id from link rel attribute
    var thisId = $(this).attr('rel');

    // Get index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) {
        return arrayItem._id
    }).indexOf(thisId);

    // Get our user object
    var thisUserObject = userListData[arrayPosition];

    // Pop up a confirmation dialog
    var confirmation = confirm("Are you sure you want to delete username " + thisUserObject.username + "?");

    // Check to make sure the user confirmed
    if (confirmation === true) {
        // If he did, then do the delete
        $.ajax({
            type    :   "DELETE",
            url     :   "/users/deleteuser/" + $(this).attr("rel")
        }).done(function(response) {
            // Check for successful (blank) response
            if (response.msg === "") {
            } else {
                alert("Error: " + response.msg);
            }
            // Update the table
            populateTable();
        });
    } else {
        // If he did not confirm, do nothing
        return false;
    }
}