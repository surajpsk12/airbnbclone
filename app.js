const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js')
const session = require('express-session');
const flash = require('connect-flash');


main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);


const sessionOptions = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get('/',
     (req, res) => {
        res.send('Welcome to Wanderlust');
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.use(
    (req, res, next) => {
        next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req, res,next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs", {err});
});




app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
}); 