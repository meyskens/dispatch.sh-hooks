import { HelmetController } from "./helmet"
import * as files from "./files"
import * as envvars from "./envvars"
import * as databases from "./databases"

const helmet = new HelmetController(process.env.HELMET_URL, process.env.HELMET_TOKEN)

export const buildChartAndDeploy = async (app) => {
    const secrets = await files.getFilesForApp(app._id)
    const vars = await envvars.getForApp(app._id)
    const dbs = await databases.getForApp(app._id)

    const values = {
        time: "" + (new Date()).getTime(),
        image: app.image,
        replicas: app.replicas,
        domain: app.domain,
        altDomains: app.altDomains,
        forceHTTPS: app.forceHTTPS,
        secrets: [],
        envvars: [],
        mongodb: {
            enabled: false,
        },
        postgresql: {
            enabled: false,
        },
        mariadb: {
            enabled: false,
        },
        redis: {
            enabled: false,
        },
    }

    for (let secret of secrets) {
        values.secrets.push({
            name: secret.path.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(),
            path: secret.path,
            value: secret.content,
        })
    }

    for (let envvar of vars) {
        values.envvars.push({
            key: envvar.key,
            value: envvar.value,
        })
    }

    for (let db of dbs) {
        if (db.name === "MongoDB") {
            values.mongodb.enabled = true
            values.mongodb.username = db.username
            values.mongodb.password = db.password
        }

        if (db.name === "PostgreSQL") {
            values.postgresql.enabled = true
            values.postgresql.username = db.username
            values.postgresql.password = db.password
            values.postgresql.database = db.database
        }

        if (db.name === "MariaDB") {
            values.mariadb.enabled = true
            values.mariadb.username = db.username
            values.mariadb.password = db.password
            values.mariadb.database = db.database
        }

        if (db.name === "Redis") {
            values.redis.enabled = true
        }
    }

    return helmet.create(app.internalName.toLowerCase(), values)
}