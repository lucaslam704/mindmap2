import { TaskType } from "../services/firestoreService";

export type RootStackParamList = {
  Home: undefined;
  School: undefined;
  Chores: undefined;
  Errands: undefined;
  Settings: undefined;
  TaskDetails: { task: TaskType; fromCompleted?: boolean };
  CompletedTask: { category: string };
};
