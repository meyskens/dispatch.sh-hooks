import { HelmetController } from "./helmet"
import * as files from "./files"
import * as envvars from "./envvars"

const helmet = new HelmetController(process.env.HELMET_URL, process.env.HELMET_TOKEN)

export const buildChartAndDeploy = async (app) => {
    const secrets = await files.getFilesForApp(app._id)
    const vars = await envvars.getForApp(app._id)
    const values = {
        image: app.image,
        replicas: app.replicas,
        domain: app.domain,
        altDomains: app.altDomains,
        secrets: [],
        envvars: [],
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

    return helmet.create(app.internalName.toLowerCase(), values)
}