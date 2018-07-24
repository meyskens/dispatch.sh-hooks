import express from "express"
import bodyParser from "body-parser"

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw({ type: "application/vnd.docker.distribution.events.v1+json" }))

app.get("/", (req, res) => {
    res.send("Duspatch.sh hooks server")
})

app.all("/docker", (req, res) => {
    if (req.header("Authorization") !== `Bearer ${process.env.DOCKER_TOKEN}`) {
        return res.status(401).send("Invalid token")
    }

    const body = JSON.parse(req.body)
    for (let event of body.events) {
        console.log(event)
    }
    
    console.log(body)

    res.send("ok")
})

app.listen(80, () => console.log("Listening on port 80"))
