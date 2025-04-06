// src/services/firestoreService.ts
import { db } from "../../firebaseConfig";
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  query,
  where
} from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { networkService } from './networkService';

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
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No authenticated user found");

    const taskToSave = {
      ...task,
      userId,
      dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
      createdAt: Timestamp.now(),
      pendingSync: !networkService.isNetworkOnline() // Add sync status
    };
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Get all tasks for the current user
export const getTasks = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No authenticated user found");

    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(tasksQuery);
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
  userId: string; // Add userId to the type
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
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No authenticated user found");

    // Verify task ownership before updating
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const taskDoc = await getDocs(query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId)
    ));
    
    if (taskDoc.empty) {
      throw new Error("Task not found or unauthorized");
    }

    const fieldsToUpdate = { ...updatedFields };
    
    if (fieldsToUpdate.dueDate instanceof Date) {
      fieldsToUpdate.dueDate = Timestamp.fromDate(fieldsToUpdate.dueDate);
    } else if (fieldsToUpdate.dueDate === undefined) {
      fieldsToUpdate.dueDate = null;
    }
    
    await updateDoc(taskRef, fieldsToUpdate);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No authenticated user found");

    // Verify task ownership before deleting
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const taskDoc = await getDocs(query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId)
    ));
    
    if (taskDoc.empty) {
      throw new Error("Task not found or unauthorized");
    }

    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Add a function to sync pending changes
export const syncPendingTasks = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const pendingTasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId),
      where("pendingSync", "==", true)
    );

    const pendingTasks = await getDocs(pendingTasksQuery);
    
    const updatePromises = pendingTasks.docs.map(doc => 
      updateDoc(doc.ref, { pendingSync: false })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error syncing pending tasks:", error);
  }
};
