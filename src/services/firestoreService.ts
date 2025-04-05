// src/services/firestoreService.ts
import { db } from "../../firebaseConfig";
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp 
} from "firebase/firestore";

const TASKS_COLLECTION = "tasks";

// Add a new task
export const addTask = async (task: {
  title: string;
  description?: string;
  priority: string;
  category: string;
  completed: boolean;
  dueDate?: Date;
}) => {
  try {
    // Convert Date to Firestore timestamp before saving
    const taskToSave = {
      ...task,
      dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null
    };
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Get all tasks
export const getTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TASKS_COLLECTION));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate ? data.dueDate.toDate() : undefined
      };
    }) as TaskType[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export type TaskType = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  category: "School" | "Chores" | "Errands";
  completed: boolean;
  dueDate?: Date;
};

// Update a task
export const updateTask = async (taskId: string, updatedFields: Partial<any>) => {
  try {
    // Convert Date to Firestore timestamp if present
    const fieldsToUpdate = { ...updatedFields };
    
    if (fieldsToUpdate.dueDate instanceof Date) {
      fieldsToUpdate.dueDate = Timestamp.fromDate(fieldsToUpdate.dueDate);
    } else if (fieldsToUpdate.dueDate === undefined) {
      // Convert undefined to null for Firestore
      fieldsToUpdate.dueDate = null;
    }
    
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, fieldsToUpdate);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
