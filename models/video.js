// models/song.js
const mongoose = require("mongoose"); // require package

// define the schema for each video
const videoSchema = new mongoose.Schema({
    title: String,
    channel: String,
    link: String,
    favorite: Boolean,
});

// link the schema to a model to connect the defined structure to our database
const Video = mongoose.model("Video", videoSchema);

// export the model so we can use it in other places in our application
module.exports = Video;

// last step: import model into server.js file 