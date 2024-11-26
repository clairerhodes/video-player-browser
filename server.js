// ============================================ import modules here! ============================================ // 
const dotenv = require("dotenv"); // require package
dotenv.config(); // loads environment variables from .env file

const express = require("express");
const mongoose = require("mongoose"); // require mongoose
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path"); // require path to style
const port = process.env.PORT ? process.env.PORT : "3006";
const app = express();

mongoose.connect(process.env.MONGODB_URI); // connect to MongoDB using string in .env file
// log connection status to terminal upon start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

// add middleware
app.use(express.urlencoded({ extended: false })); // expects data to be coming in from a form, extracts it and puts into JS object which is attached to req.body
// ez access to our data via route handlers
app.use(methodOverride("_method"));
// app.use(morgan("dev")); // commented out since terminal getting crowded with additional info
app.use(express.static(path.join(__dirname, "public"))); // adding middleware to serve static files from directory
app.use(morgan('dev'));

// import our song model after we connect to mongoose
const Video = require("./models/video.js");



// ============================================ build my routes ============================================ // 
// GET / to route to the home page and connect to index.ejs
app.get("/", async (req, res) => {
    res.render("home.ejs");
});


// GET /videos - show list of video library
app.get("/videos", async (req, res) => {
    const allVideos = await Video.find();
    res.render('videos/index.ejs', {
        videos: allVideos,
    });
});


// POST /videos to process form data
app.post('/videos', async (req, res) => {
    // console.log(req.body);
    if(req.body.favorite === 'on') { // when checked, show favorite as true
        req.body.favorite = true
    } else {
        req.body.favorite = false
    }
    await Video.create(req.body); // send info to database once it is provided
    res.redirect('/videos'); // redirect user back to video library
});


// GET /videos/new to display form to enter new video
app.get("/videos/new", async (req, res) => {
    // res.send("This route shows a form to add a new video!");
    res.render('videos/new.ejs'); // show ejs page for new video addition
});


// GET /videos/:videoId to look up specific video
app.get("/videos/:videoId", async (req, res) => {
    const foundVideo = await Video.findById(req.params.videoId);
    // res.send(`This route renders the show page for video id: ${foundVideo}!`);
    res.render('videos/show.ejs', { video: foundVideo });
});


// DELETE //videos/:videoId to delete video
app.delete("/videos/:videoId", async (req, res) => {
    await Video.findByIdAndDelete(req.params.videoId); // find video by ID and delete
    // res.send(req.params.videoId);
    res.redirect('/videos');
});



// edit route (this can go anywhere, order does not matter for this route)
// GET localhost:3006/videos/:videoId/edit
app.get("/videos/:videoId/edit", async (req, res) => {
    // res.send('edit page');
    const foundVideo = await Video.findById(req.params.videoId); // get specific video by using its ID
    res.render('videos/edit.ejs', { video: foundVideo });
});



// PUT to update a video (order doesnt matter bc only PUT route)
// must use PUT requests for forms
app.put('/videos/:videoId', async (req, res) => {
    // format checkbox data inot a boolean instead of on/off
    if(req.body.favorite === 'on') {
        req.body.favorite = true
    } else {
        req.body.favorite = false
    }
    await Video.findByIdAndUpdate(req.params.videoId, req.body);
    // res.send(req.body);
    res.redirect('/videos');
});






// create port listener at bottom of js page!
app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });