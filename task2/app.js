const express = require('express');
const helmet = require('helmet');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  })
);

const comments = [];

app.get('/', (req, res) => {
  res.render('index', { comments, error: null });
});

app.post('/comment', (req, res) => {
  const text = req.body.text || '';

  if (text.length > 200) {
    return res.status(400).render('index', {
      comments,
      error: 'Комментарий не должен превышать 200 символов',
    });
  }

  const cleanText = DOMPurify.sanitize(text);
  comments.push(cleanText);

  res.redirect('/');
});

app.listen(3000, () => console.log('Сервер запущен: http://localhost:3000'));
