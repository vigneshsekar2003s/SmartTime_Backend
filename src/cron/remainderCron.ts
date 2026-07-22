import cron from "node-cron";
import Task from "../models/Task";
import User from "../models/User";
import sendEmail from "../utils/sendEmail";

cron.schedule("* * * * *", async () => {
  console.log("Checking task reminders...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const tasks = await Task.find({
      dueDate: {
        $gte: today,
        $lt: tomorrow,
      },
      status: "Pending",
      reminderSent: false,
    }).populate("user");

       console.log("Tasks Found:", tasks.length);

    for (const task of tasks) {
      const user: any = task.user;

      if (!user || !user.email){
         console.log(`User or email not found for task: ${task.title}`);
         continue;
      }

         console.log("Sending email to:", user.email);

      await sendEmail(
        user.email,
        "📅 Smart Time Scheduler Reminder",
        `Hello ${user.name},

Your task "${task.title}" is due today.

Priority: ${task.priority}
Category: ${task.category}

Please complete it before the deadline.

Thank you,
Smart Time Scheduler`
      );

      task.reminderSent = true;
      await task.save();

      console.log(`Reminder sent to ${user.email}`);
    }
  } catch (error) {
    console.error(error);
  }
});