import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  changes: {
    type: Map,
    of: Object,
    required: true,
  },
  changedAt: {
    type: Date, 
    default: Date.now
  }
});

const History = mongoose.model('History', historySchema);
export default History;
                                                                                                    