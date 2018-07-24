import mongoose from "./db"


const Schema = mongoose.Schema
const AppsSchema = new mongoose.Schema({
    name: String,
    internalName: String,
    repo: String,
    values: Object,
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
}, { collection: "apps" })
AppsSchema.index({
    repo: 1,
})

const AppsModel = mongoose.model("apps", AppsSchema, "apps")

export const getAppForRepo = (repo) => {
    return AppsModel.findOne({
        repo,
    }).exec()
}
