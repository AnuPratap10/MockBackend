const express = require("express")
const { connections } = require("./config/db")
const { UserModel } = require("./models/User.model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const cors = require("cors")
require('dotenv').config()


const app = express()
app.use(express.json())

app.use(express.json())
app.use(cors({
    origin: "*"
}))


app.get("/", (req, res) => {
    res.send("Home Page here")
})

// post req......signup...............

app.post("/signup", async (req, res) => {

    const { email, password } = req.body;
    const userExist = await UserModel.findOne({ email })

    if (userExist?.email) {
        res.send("User already exist")
    }
    else {
        try {
            bcrypt.hash(password, 3, async function (err, hash) {
                const user = new UserModel({ email, password: hash })
                await user.save()
                res.send("Sign up successfull")
            });

        }
        catch (err) {
            console.log(err)
            res.send("Something  wrong, please try again")
        }
    }

})

// .........login sec..........................................

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email })

        if (user.length > 0) {

            const hashed_password = user[0].password;
            bcrypt.compare(password, hashed_password, function (err, result) {
                if (result) {

                    const token = jwt.sign({ "userID": user[0]._id }, 'hush');
                    res.send({ "massege": "Login successfull", "token is": token })
                }
                else {
                    res.send("Login failed")
                }
            })
        }
        else {
            res.send("Login failed")
        }
    }
    catch {
        res.send("Something  wrong, please try again")
    }
})



app.listen(7000, async () => {
    try {
        await connections;
        console.log("Connect to db successfull")
    }
    catch (err) {
        console.log("Connect to db failed")
    }
    console.log("Listing on http://localhost:7000")
})
