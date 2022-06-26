const express = require('express')
const app = express()
const cors = require('cors')
const bs = require("body-parser")
const uniqid = require("uniqid")
require('dotenv').config()


app.use(cors())
app.use(express.static('public'))
app.use(bs.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = []
let exercises = []


app.post("/api/users", (req, res) => {
  const username = req.body.username
  let userInfo = { username, _id: uniqid() }
  users.push(userInfo)
  res.json(userInfo)
})

app.get("/api/users", (req, res) => {
  res.json(users)
})

app.post("/api/users/:_id/exercises", (req, res) => {
  const _id = req.params._id
  const schema = {username: req.body.username,description: req.body.description,duration: Number(req.body.duration),date: new Date(req.body.date).toDateString(),_id}
  users.forEach(user => {
    if (user._id === _id) {
      exercises.push(schema)
      res.json(schema)
    }
  })
})

app.get("/api/users/:_id/logs", (req, res) => {
  const _id = req.params._id
  let returnedJson = {}
  let exerciseArray = []
  users.forEach(user => {
    if (user._id == _id) {
      exercises.forEach(exercise => {
        exerciseArray.push(exercise)
        if (exercise._id == user._id) {
          returnedJson.username = user.username,
          returnedJson.count = exerciseArray.length,
          returnedJson._id = user._id,
          returnedJson.log = exerciseArray
        }
      })
    }
  })
  res.json(returnedJson)
  exerciseArray = []
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
