import mongoose from "./db"

const ObjectId = mongoose.Types.ObjectId
const DatabasesSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: [
            "MongoDB",
            "PostgreSQL",
            "MariaDB",
            "Redis",
        ]
    },
    username: String,
    password: String,
    database: String,
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "apps",
    },
}, { collection: "databases" })
DatabasesSchema.index({
    app: 1,
    name: 1,
})

const DatabasesModel = mongoose.model("databases", DatabasesSchema, "databases")

export const getForApp = (app) => {
    return DatabasesModel.findOne({
        app: ObjectId(app),
    })
}
