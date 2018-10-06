import express from "express"
import bodyParser from "body-parser"
import * as apps from "./components/apps"
import * as updates from "./components/updates"
import * as builder from "./components/builder"


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
                if (appEntry.image) {
                    const imageParts = appEntry.image.split(":")
                    if (imageParts.length === 2) {
                        oldTag = imageParts[1]
                    } 
                }

                appEntry.image = `registry.dispatch.sh/${repo}:${tag}`
                try {
                    await builder.buildChartAndDeploy(appEntry)
                } catch (error) {
                    // just log this as Docker will keep retrying till a 200 which overloaded the kubernetes api
                    console.log(error)
                }
                
                await apps.updateImage(appEntry._id, appEntry.image )
                await updates.add(appEntry._id, oldTag, tag)
            }
        }
    }

    res.send("ok")
}))

app.listen(80, () => console.log("Listening on port 80"))
