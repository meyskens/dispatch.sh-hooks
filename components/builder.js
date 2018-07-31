import { HelmetController } from "./helmet"

const helmet = new HelmetController(process.env.HELMET_URL, process.env.HELMET_TOKEN)

export const buildChartAndDeploy = (app) => {
    const values = {
        image: app.image,
        replicas: app.replicas,
        domain: app.domain,
        altDomains: app.altDomains,
    }

    return helmet.create(app.internalName.toLowerCase(), values)
}