import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const migrateExistingTasks = async (userId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    
    const batch: Promise<void>[] = [];
    querySnapshot.forEach((document) => {
      const taskRef = doc(db, "tasks", document.id);
      if (!document.data().userId) {
        batch.push(updateDoc(taskRef, { userId }));
      }
    });
    
    await Promise.all(batch);
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  }
};