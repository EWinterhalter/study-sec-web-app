const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });

app.set('view engine', 'ejs');

let user = {
  id: 1,
  email: 'user@example.com'
};

function checkOrigin(req, res, next) {
  const origin = req.get('origin');
  const referer = req.get('referer');

  const allowedOrigin = 'http://localhost:3000';

  if (origin && origin !== allowedOrigin) {
    return res.status(403).send('Запрос с другого Origin запрещён');
  }

  if (!origin && referer && !referer.startsWith(allowedOrigin)) {
    return res.status(403).send('Запрос с другого Referer запрещён');
  }

  next();
}

app.get('/', csrfProtection, (req, res) => {
  res.render('profile', {
    email: user.email,
    csrfToken: req.csrfToken()
  });
});

app.post('/update-email', checkOrigin, csrfProtection, (req, res) => {
  user.email = req.body.email;
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Сервер: http://localhost:3000');
});
