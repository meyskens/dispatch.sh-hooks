
import mongoose from "mongoose"

mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}`)
mongoose.connection.on("connected", () => {
    console.info("Connected to the database")
})
mongoose.connection.on("error", (err) => {
    console.error(err, "Failed to connect to the database")
    process.exit(1)
})

exports = mongoose
