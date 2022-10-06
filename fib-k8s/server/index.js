const keys = require("./keys")

// Express App setup
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Postgres client setup
const { Pool } = require("pg")
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})
pgClient.on("error", () => console.log("Lost PG connection"))

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch((error) => console.log(error))

// Redis client setup
const redis = require("redis")
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})
const redisPublisher = redisClient.duplicate()

// Express route handlers
app.get("/", (_, res) => {
  res.send("Hi")
})
app.get("/values/all", async (_, res) => {
  const values = await pgClient.query("SELECT * FROM values")
  res.send(values.rows)
})
app.get("/values/current", async (_, res) => {
  redisClient.hgetall("values", (_, values) => {
    res.send(values)
  })
})
app.post("/values", async (req, res) => {
  const index = req.body.index
  console.log(`Reveived index ${ index }`)
  if (parseInt(index) > 40) {
    res.status(422).send("Index oo high")
  }
  redisClient.hset("values", index, "Nothing yet!")
  console.log(`Posting ${ index } to Redis`)
  redisPublisher.publish("insert", index)
  console.log(`Publishing Insert event with ${ index } to Redis`)
  pgClient.query("INSERT INTO values(number) VALUES($1)", [ index ])
  console.log(`Inserting ${ index } to Postgres`)
  res.send({ working: true })
})

app.listen(5000, () => {
  console.log("Listening")
})