import { addTask, getTasks, deleteTask, updateTask, TaskType } from "../services/firestoreService";
import * as Notifications from 'expo-notifications';

export const fetchTasksByCategory = async (category: string) => {
  const data = await getTasks();
  return data.filter(task => task.category === category);
};

export const handleAddTask = async (newTask: TaskType, category: string) => {
  if (!newTask.title || !newTask.dueDate) return;

  const localDate = new Date(
    newTask.dueDate.getFullYear(),
    newTask.dueDate.getMonth(),
    newTask.dueDate.getDate(),
    newTask.dueDate.getHours(),
    newTask.dueDate.getMinutes()
  );

  const taskToAdd = { ...newTask, category, completed: false, dueDate: localDate };
  await addTask(taskToAdd);

  if (taskToAdd.dueDate) {
    await scheduleNotification(taskToAdd.dueDate, taskToAdd.title);
  }
};

export const handleMarkCompleted = async (taskId: string) => {
  await updateTask(taskId, { completed: true });
};

const scheduleNotification = async (dueDate: Date, title: string) => {
  if (!dueDate) return;
  const now = new Date();
  if (dueDate <= now) {
    await Notifications.scheduleNotificationAsync({
      content: { title: "MindMap", body: `Past due task: ${title}\nDue date: ${dueDate.toLocaleString()}` },
      trigger: null
    });
  } else {
    await Notifications.scheduleNotificationAsync({
      content: { title: "MindMap", body: `Upcoming task: ${title}\nDue date: ${dueDate.toLocaleString()}` },
      trigger: { channelId: 'default', date: dueDate, repeats: false }
    });
  }
};
