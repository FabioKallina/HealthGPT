
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [
    {
      sender: { type: String, enum: ['user', 'ai'], required: true },
      text: { type: String, required: true }
    }
  ],
  response: String,
  createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;