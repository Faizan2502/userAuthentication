document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    // Send a POST request to the server
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(response => response.json())
      .then(data => {
        // Display the success message
        alert(data.message);
  
        // Clear the form fields
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle the error or display an error message to the user
      });
  });
  