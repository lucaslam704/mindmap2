import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { deleteTask, updateTask, TaskType } from "../services/firestoreService";
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/ScreenStyle.styles';

const TaskItem = ({ task, fetchTasks }: { task: TaskType; fetchTasks: () => void }) => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const handleMarkCompleted = async () => {
    await updateTask(task.id, { completed: true });
    fetchTasks();
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return theme.colors.highPriority;
      case 'medium':
        return theme.colors.mediumPriority;
      case 'low':
        return theme.colors.lowPriority;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.taskItem,
        { 
          backgroundColor: theme.colors.cardBackground,
          borderLeftWidth: 5,
          borderLeftColor: getPriorityColor(task.priority)
        }
      ]}
      onPress={() => navigation.navigate("TaskDetails", { task })}
    >
      <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
        {task.title}
      </Text>
      <Text style={[styles.taskInfo, { color: getPriorityColor(task.priority) }]}>
        Priority: {task.priority}
      </Text>
      <Text style={[styles.taskInfo, { color: theme.colors.textSecondary }]}>
        Due Date: {task.dueDate ? task.dueDate.toLocaleString() : "No due date"}
      </Text>
      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined"
          onPress={() => deleteTask(task.id).then(fetchTasks)}
          textColor={theme.colors.error}
          buttonColor={theme.colors.cardBackground}
          style={styles.button}
        >
          Delete
        </Button>
        <Button 
          mode="contained"
          onPress={handleMarkCompleted}
          textColor={theme.colors.white}
          buttonColor={theme.colors.primary}
          style={styles.button}
        >
          Complete
        </Button>
      </View>
    </TouchableOpacity>
  );
};

export default TaskItem;
