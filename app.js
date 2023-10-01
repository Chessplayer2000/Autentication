//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";


const app = express();
const port = 3000;

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
try {
const foundUser = await User.findOne({email: username})

if (foundUser) {
    if (foundUser.password === password) {
        res.render("secrets");
    } 
}
} catch (error){
    console.log(error.message);
}
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
  
  res.render("secrets");
        
    });
    

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});