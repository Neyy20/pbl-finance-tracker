import mongoose from "mongoose";

interface User {
  username: string;
  password: string;
  email: string;
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;