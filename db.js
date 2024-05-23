const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ankitverma11032002:r4qi.pgDWyp9BhD@ankbit.1we3kvi.mongodb.net/validate');
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};


module.exports = {connectDB};