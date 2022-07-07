const mongoose = require("mongoose");
const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 50; ++i) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dsrb383tq/image/upload/v1657153941/YelpCamp/aqkgswhlbmdcpwx9e6oz.jpg",
          filename: "YelpCamp/aqkgswhlbmdcpwx9e6oz",
        },
        {
          url: "https://res.cloudinary.com/dsrb383tq/image/upload/v1657153942/YelpCamp/q4qspwpdfjixv6zf3jwj.jpg",
          filename: "YelpCamp/q4qspwpdfjixv6zf3jwj",
        },
        {
          url: "https://res.cloudinary.com/dsrb383tq/image/upload/v1657153940/YelpCamp/bx5azmztq4nsbjrrbi8t.jpg",
          filename: "YelpCamp/bx5azmztq4nsbjrrbi8t",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      author: "62c540dc0cfbacd4393bd72b",
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. ",
      price: Math.floor(Math.random() * 100) + 100,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
