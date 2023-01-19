const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const apiRouter = express.Router();
const path = require('path');
const viewsDir = path.join(__dirname, 'views');
const cors = require('cors');
// express session lub ciasteczka

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', apiRouter);

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'Login',
  port: 3308
});

connection.connect((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Successfully connected to the database.');
  }
});


apiRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  connection.query(query, [name, email, password], (error, result) => {
    if (error) {
      console.error(error);
      res.send('An error occurred');
    } else {
      res.render({ message: 'Corretly registered!' });
      setTimeout(() => {
        res.redirect('http://localhost:81/login.html');
      }, 3000);
    }
  });
});

apiRouter.get('/conversation', (req, res) => {
  // Retrieve logged-in user's name, email
  
  const userQuery = `SELECT name, email FROM users WHERE email = ?`;
  connection.query(userQuery, [global.email_loggedin], (error, result) => {
  if (error) {
    console.error(error);
  }
  const userRows = result;
  const name = userRows[0].name;
  const email = userRows[0].email;

  // Render the conversation.html template and pass the name and email variables
  res.render(viewsDir + '/conversation', { 
    name: name,
    email: email 
    });
  });
});

apiRouter.get('/conversations', (req, res) => {
  // Retrieve logged-in user's name, message
  
  const userQuery = `SELECT * FROM conversations`;
  connection.query(userQuery, (error, result) => {
  if (error) {
    console.error(error);
  }
  const userRows = result;

  // Render the conversation.html template and pass the name and email variables
  res.render(viewsDir + '/conversations', { 
    rows: userRows 
    });
  });
});

// Funkcja obsługująca żądanie logowania
apiRouter.post('/login', (req, res) => {
    // Pobieramy dane logowania z formularza
    const { email, password } = req.body;
  
    // Tworzymy zapytanie SQL do sprawdzenia, czy podana nazwa użytkownika i hasło są poprawne
    const query = `SELECT * FROM users WHERE email = (?) AND password = (?)`;
    connection.query(query, [email, password], (error, result) => {
      if (error) {
        console.error(error);
        res.send('An error occurred');
      }
      if(email === 'admin@makabuild.com'){
        setTimeout(() => {
          const updateQuery = `UPDATE admin SET active = true WHERE email = (?)`;
          connection.query(updateQuery, [email]);
          global.email_loggedin_admin = email;
          console.log(global.email_loggedin_admin);
          res.redirect('http://localhost:81/index_logged_in_admin.html');
        }, 3000);
        return;
      } 
      // Jeśli wynik zapytania jest pusty, oznacza to, że nazwa użytkownika lub hasło są niepoprawne
      if (result.length === 0) {
        setTimeout(() => {
          res.redirect('http://localhost:81/login.html');
        }, 3000);
        return;
    
      } else {
        setTimeout(() => {
          const updateQuery = `UPDATE users SET active = true WHERE email = (?)`;
          connection.query(updateQuery, [email]);
          global.email_loggedin = email;
          console.log(global.email_loggedin);
          res.redirect('http://localhost:81/index_logged_in.html');
        }, 3000);
      }
    });
  });
  
  apiRouter.post('/log-out', cors(), (req, res) => {
    // Update the `active` field to false for the user with the logged in email
    const sql = "UPDATE users SET active = false WHERE email = (?)";
    connection.query(sql, [global.email_loggedin], (err, result) => {
      if (err) throw err;
      console.log("User logged out successfully");
    });
  
    // Redirect to home page
    res.redirect('/');
  });

  apiRouter.post('/log-out-admin', cors(), (req, res) => {
    // Update the `active` field to false for the user with the logged in email
    const sql = "UPDATE admin SET active = false WHERE email = (?)";
    connection.query(sql, [global.email_loggedin_admin], (err, result) => {
      if (err) throw err;
      console.log("Admin logged out successfully");
    });
  
    // Redirect to home page
    res.redirect('/');
  });

  // Handle form submission
  apiRouter.post('/conversation', cors(), (req, res) => {

    // const name = req.body.name;
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    console.log(req.body)
  
      // Insert conversation data into MySQL database
      const sql = "INSERT IGNORE INTO conversations (message, email, name) VALUES (?, ?, ?)";
      connection.query(sql, [ message, email, name], (err, result) => {
        if (err) throw err;
        console.log("Conversation data saved to database");
      });
  
      // Redirect to home page
      res.redirect('/');
    });

app.listen(3000, () => {
  console.log('Node.js server is listening on port 3000');
});




