import mongoose from "mongoose"
import User from "../models/user.model.js"

const connectMongoDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MONGO CONNECT : ${conn.connection.host}`)
        
        const result = await User.updateMany({}, {$unset: {admin: ""}})
        console.log(`${result.modifiedCount} users updated`);

    } catch (error) {
        console.log(`error connedct : ${error.message}`)
        process.exit(1)
    }
}

export default connectMongoDb