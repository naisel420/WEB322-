require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;


const loginHistorySchema = new Schema({
  dateTime: Date,
  userAgent: String
});


const userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
  loginHistory: [loginHistorySchema]
});

let User;


function initialize() {
  return new Promise((resolve, reject) => {
    const mongodbConnectionString = process.env.MONGODB; 
    mongoose.connect(mongodbConnectionString)
      .then(() => {
        console.log("MongoDB connected successfully");
        User = mongoose.model("users", userSchema);
        resolve();
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        reject(err);
      });
  });
}


function registerUser(userData) {
  return new Promise(async (resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    try {
      const hash = await bcrypt.hash(userData.password, 10); 
      const newUser = new User({
        userName: userData.userName,
        password: hash,
        email: userData.email,
        loginHistory: []
      });

      await newUser.save();
      resolve();
    } catch (err) {
      if (err.code === 11000) {
        reject("User Name or Email already taken");
      } else {
        reject(`There was an error creating the user: ${err.message}`);
      }
    }
  });
}


function checkUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ userName: userData.userName });

      if (!user) {
        reject(`Unable to find user: ${userData.userName}`);
        return;
      }

      const match = await bcrypt.compare(userData.password, user.password);

      if (!match) {
        reject(`Incorrect Password for user: ${userData.userName}`);
        return;
      }

      
      if (user.loginHistory.length === 8) {
        user.loginHistory.pop(); 
      }

      user.loginHistory.unshift({
        dateTime: new Date().toString(),
        userAgent: userData.userAgent
      });

      await User.updateOne(
        { _id: user._id },
        { $set: { loginHistory: user.loginHistory } }
      );

      resolve(user);
    } catch (err) {
      reject(`Unable to find or validate the user due to an error: ${err.message}`);
    }
  });
}

module.exports = {
  initialize,
  registerUser,
  checkUser
};
