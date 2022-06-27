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
  
  const schema = {description: req.body.description,duration: Number(req.body.duration),_id}
  req.body.date === undefined ? (schema.date = new Date().toDateString()) : (schema.date = new Date(req.body.date).toDateString())
  users.forEach(user => {
    if (user._id === _id) {
      schema.username = user.username
      exercises.push(schema)
      res.json(schema)
    }
  })
})

app.get("/api/users/:_id/logs", (req, res) => {
  const _id = req.params._id
  let returnedJson = {}
  let exerciseArray = []
  const from = new Date(req.query.from).getTime()
  const to = new Date(req.query.to).getTime()
  const limit = Number(req.query.limit)


  users.forEach(user => {
    if (user._id == _id) {
      exercises.forEach(exercise => {
        if (exercise._id == user._id) {
          exerciseArray.push(exercise)
          returnedJson.username = user.username,
          returnedJson.count = exerciseArray.length,
          returnedJson._id = user._id,
          returnedJson.log = exerciseArray
        }
      })
    }
  })
  

  if (!isNaN(from) && !isNaN(to)) {
    exerciseArray = returnedJson.log.filter(exercise => {
      return from < new Date(exercise.date).getTime() && to > new Date(exercise.date).getTime()
    })
    returnedJson.log = exerciseArray
  }
  
  if (!isNaN(limit)) {
    limit == 1 ? (exerciseArray = [exerciseArray[0]]) : (exerciseArray = exerciseArray.slice(0, limit))
    returnedJson.log = exerciseArray
  }


  res.json(returnedJson)
  exerciseArray = []
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
