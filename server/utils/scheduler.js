import Shift from '../model/Shift.js';
import Notification from '../model/Notification.js';

export function initShiftReminderScheduler() {
  setInterval(async () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    try {
      const shifts = await Shift.find({
        date: {
          $gte: tomorrow,
          $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
        },
      }).populate('nurse');

      for (const shift of shifts) {
        const exists = await Notification.findOne({
          user: shift.nurse._id,
          message: { $regex: shift._id.toString() },
          read: false,
        });
        if (!exists) {
          const message = `Reminder: You have a ${shift.shiftType} shift on ${shift.date.toDateString()}`;
          const notif = new Notification({ user: shift.nurse._id, message });
          await notif.save();
        }
      }
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }, 1000 * 60 * 60); // every hour
}