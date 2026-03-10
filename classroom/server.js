const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const flash = require('connect-flash'); // used for flash messages jo ek baar show hote hain aur phir disappear ho jate hain 
const session = require('express-session');




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionOptions = {
  secret:  "mysecretkey",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash('success');
  res.locals.errorMsg = req.flash('error');
  next();
});


app.get('/register', (req,res)=> {
  let {name = "anonymous"} = req.query;
  req.session.name = name;
  if(name === "anonymous"){
    req.flash('error', 'No name provided, using anonymous');
  }else {
    req.flash('success', `User registered successfully with name: ${name}`);
  }
  res.redirect('/hello');
})



app.get('/hello', (req, res) => {
  res.render('page.ejs', { name: req.session.name });
});
  













app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
