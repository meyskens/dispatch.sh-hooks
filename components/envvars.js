import mongoose from "../db"

const ObjectId = mongoose.Types.ObjectId
const EnvVarsSchema = new mongoose.Schema({
    name: String,
    key: String,
    value: String,
    hide: Boolean,
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "apps",
    },
}, { collection: "envvars" })
EnvVarsSchema.index({
    app: 1,
    user: 1,
})

const EnvVarsModel = mongoose.model("envvars", EnvVarsSchema, "envvars")

export const getForApp = (app) => {
    return EnvVarsModel.find({
        app: ObjectId(app),
    })
}
