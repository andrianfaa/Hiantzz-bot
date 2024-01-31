import { Schema } from "mongoose";

const userBannedSchema = new Schema({
  chat_id: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  added_at: {
    type: String,
    default: () => new Date().toLocaleString("id-ID"),
  },
});

export default userBannedSchema;
