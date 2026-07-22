import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  priority: string;
  category: string;
  attachment: string;
  reminderSent: boolean;
  user: mongoose.Types.ObjectId;
 
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    category: {
  type: String,
  enum: [
    "Work",
    "Study",
    "Personal",
    "Shopping",
    "Health",],
    default: "Personal"
},

attachment: {
  type: String,
  default:"",
},

reminderSent: {
  type: Boolean,
  default: false,
},

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>("Task", taskSchema);