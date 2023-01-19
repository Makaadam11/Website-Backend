document.addEventListener('DOMContentLoaded', function() {
  const logOutButtonAdmin = document.querySelector('#log-out-button');
  logOutButtonAdmin.addEventListener('click', () => {
    // Send HTTP request to update the user's active status in the database
    fetch('http://localhost:3000/api/log-out', {
      method: 'POST'
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const logOutButtonAdmin = document.querySelector('#log-out-button-admin');
  logOutButtonAdmin.addEventListener('click', () => {
    // Send HTTP request to update the user's active status in the database
    fetch('http://localhost:3000/api/log-out-admin', {
      method: 'POST'
    });
  });
});


const form = document.querySelector('#quote-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Get form data
  const name = form.elements.name.value;
  const email = form.elements.email.value;
  const message = form.elements.message.value;
  const data = new URLSearchParams();

  data.append('name', name);
  data.append('email', email);
  data.append('message', message);
  
  fetch('http://localhost:3000/api/conversation', {
    method: 'POST',
    body: data
  });
});