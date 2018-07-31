import mongoose from "./db"

const ObjectId = mongoose.Types.ObjectId
const FilesSchema = new mongoose.Schema({
    name: String,
    path: String,
    content: String, // base64 encoded
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "apps",
    },
}, { collection: "files" })
FilesSchema.index({
    app: 1,
})

const FilesModel = mongoose.model("files", FilesSchema, "files")

export const getFilesForApp = (app) => {
    return FilesModel.find({
        app: ObjectId(app),
    })
}