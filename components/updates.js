import mongoose from "./db"

const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema
const UpdatesSchema = new mongoose.Schema({
    tag: String,
    oldTag: String,
    time: Date,
    app: {
        type: Schema.Types.ObjectId,
        ref: "apps",
    },
}, { collection: "updates" })
UpdatesSchema.index({
    app: 1,
})

const UpdatesModel = mongoose.model("updates", UpdatesSchema, "updates")

export const add = (app, oldTag, tag) => {
    return (new UpdatesModel({
        app: new ObjectId(app),
        oldTag,
        tag,
        time: Date.now(),
    })).save()
}
