// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();
// Username link click
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users/userlist', function( data ) {
// Stick our user data array into a userlist variable in the global object
  userListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });
};

// Show User Info
function showUserInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
  // Get our User Object
  var thisUserObject = userListData[arrayPosition];

  //Populate Info Box
  $('#username').text(thisUserObject.username);
  $('#userpass').text(thisUserObject.pass);
  $('#useremail').text(thisUserObject.email);
  $('#userphone').text(thisUserObject.phone);

};

  // Add User button click
  $('#btnAddUser').on('click', addUser);

// Add User
function addUser(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  var i=0;
  var phoneno = /^\d{10}$/;
  var emailreg = /@+/;

  
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#username').val(),
      'pass': $('#addUser fieldset input#userpass').val(),
      'email': $('#addUser fieldset input#useremail').val(),
      'phone': $('#addUser fieldset input#userphone').val(),
    }

//alert(newUser['phone']);
if(newUser['phone'].match(phoneno)){

	i=1;
}
else{
	alert('Phone Number Wrong (Should have 10 numbers)!');
	return false
}
 

if(newUser['username'].length <= 25){

	i=1;
}
else{
	alert('User Name Too Long (Maximum Length Allowed is 25 )!');
	return false
}
if(newUser['pass'].length <= 25){

	i=1;
}
else{
	alert('Password too Long (Maximum Length Allowed is 25 )!');
	return false
}
if(newUser['email'].match(emailreg)){
if(newUser['email'].length <= 50 ){

	i=1;
}
else{
	
	alert('Email Too Long (Maximum Length Allowed is 50 )!');
	return false;
}   }
else{
	alert('Invalid Email-Id : Should have @!');
	return false;
}
    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addUser fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

