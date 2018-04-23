const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const app = express();
const db = require('./config/database');
const port = process.env.PORT || 5000;
//Connect to mongoose
mongoose.connect(db.mongoURI).then(() => console.log("mongodb connected")).catch((err) => console.log(err));
// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');
//habdlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Method override middleware
app.use(methodOverride('_method'));
//index route
app.get('/', (req, res) => {
  let title = 'Welcome';
  res.render("index", {
    title: title
  });
});
//about route
app.get('/about', (req, res) => {
  res.render("about");
});
//Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});
//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit',{
      idea:idea
    });
  });
});
// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});
// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});
//Edit form process
app.put('/ideas/:id',(req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      })
  });
});
// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/ideas');
    });
});
//start sever
app.listen(port, () => {
  console.log(`Sever started on port ${port}`);
});