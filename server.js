import express from "express"
import bodyParser from "body-parser"
import * as apps from "./components/apps"
import * as updates from "./components/updates"
import { HelmetController } from "./components/helmet"

const helmet = new HelmetController(process.env.HELMET_URL, process.env.HELMET_TOKEN)

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw({ type: "application/vnd.docker.distribution.events.v1+json" }))

const wrap = fn => (...args) => fn(...args).catch(args[2])

app.get("/", (req, res) => {
    res.send("Dispatch.sh hooks server")
})

app.all("/docker", wrap(async(req, res) => {
    if (req.header("Authorization") !== `Bearer ${process.env.DOCKER_TOKEN}`) {
        return res.status(401).send("Invalid token")
    }

    const body = JSON.parse(req.body)
    for (let event of body.events) {
        if (event.action === "push") {
            console.log(JSON.stringify(event))
            const repo = event.target.repository
            const tag = event.target.tag
            if (!repo || !tag) {
                continue
            }
            
            const appEntry = await apps.getAppForRepo(repo)
            if (appEntry) {
                let oldTag = ""
                if (!appEntry.values) {
                    appEntry.values = {}
                }
                if (appEntry.values.image) {
                    const imageParts = appEntry.values.image.split(":")
                    if (imageParts.length === 2) {
                        oldTag = imageParts[1]
                    } 
                }

                appEntry.values.image = `harbor.dispatch.sh/${repo}:${tag}`
                await helmet.create(appEntry.internalName, appEntry.values)
                
                await apps.updateImage(appEntry._id, appEntry.values.image )
                await updates.add(appEntry._id, oldTag, tag)
            }
        }
    }

    res.send("ok")
}))

app.listen(80, () => console.log("Listening on port 80"))
