import { model } from "mongoose";
import { userBannedSchema } from "../schemas";

const UserBanned = model("user-banned", userBannedSchema);

export default UserBanned;
