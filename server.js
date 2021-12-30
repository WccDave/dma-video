const result = require('dotenv').config()
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


mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("connected to mongoose"))


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/landing', { articles: articles })
})

app.get('/add', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})



app.use('/articles', articleRouter)

app.listen(5000)