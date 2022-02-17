require('dotenv').config()
var compression = require('compression');
var helmet = require('helmet');
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()
app.use(helmet());
app.use(compression());
const PORT = process.env.PORT || 5000


mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("connected to mongoose"))

if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy",  "frame-src youtube.com www.youtube.com docs.google.com drive.google.com google.com player.vimeo.com www.vimeo.com joinreal.us12.list-manage.com rebrand.ly");
  return next();
});
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/landing', { articles: articles })
})
app.get('/home', async (req, res) => {
  res.redirect('/')
})

app.get('/about', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/about', { articles: articles })
})

app.get('/commission', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/commission', { articles: articles })
})

app.get('/revenue', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/revenue', { articles: articles })
})

app.get('/equity', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/equity', { articles: articles })
})

app.get('/culture', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/culture', { articles: articles })
})

app.get('/add', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})



app.use('/articles', articleRouter)

app.listen(PORT)