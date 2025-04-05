import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Button, FAB } from "react-native-paper";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { getTasks, deleteTask, updateTask, TaskType } from "../services/firestoreService";
import TaskModal from "../components/TaskModal";
import { createStyles } from '../styles/ScreenStyle.styles';
import { useTheme } from '../context/ThemeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SchoolScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const categoryname = "School";
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    fetchTasks();
    Notifications.requestPermissionsAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data.filter(task => task.category === categoryname));
  };

  const handleMarkCompleted = async (taskId: string) => {
    await updateTask(taskId, { completed: true });
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={tasks.filter(task => !task.completed)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.taskItem,
              { 
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.border
              }
            ]}
            onPress={() => navigation.navigate('TaskDetails', { task: item })}
          >
            <Text style={[
              styles.taskTitle,
              { color: theme.colors.text }
            ]}>
              {item.title}
            </Text>
            <Text style={[
              styles.taskInfo,
              { color: getPriorityColor(item.priority) }
            ]}>
              Priority: {item.priority}
            </Text>
            <Text style={[
              styles.taskInfo,
              { color: theme.colors.textSecondary }
            ]}>
              Due Date: {item.dueDate ? item.dueDate.toLocaleString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' }) 
                    : "No due date"}
            </Text>
            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={() => deleteTask(item.id).then(fetchTasks)}
                style={styles.button}
                textColor={theme.deleteButton.color}
                buttonColor={theme.deleteButton.background}
              >
                Delete
              </Button>
              <Button 
                mode="contained" 
                onPress={() => handleMarkCompleted(item.id)}
                style={styles.button}
                textColor={theme.completeButton.color}
                buttonColor={theme.completeButton.background}
              >
                Complete
              </Button>
            </View>
          </TouchableOpacity>
        )}
      />
      <FAB 
        icon={({ size, color }) => (
          <Image 
            source={require('../../public/images/AddTask.png')} 
            style={{ 
              width: size, 
              height: size, 
              tintColor: theme.colors.addtask 
            }}
          />
        )}
        style={styles.fabAdd}
        onPress={() => setModalVisible(true)}
      />
      <FAB 
        icon={({ size, color }) => (
          <Image 
            source={require('../../public/images/CompletedTask.png')} 
            style={{ 
              width: size, 
              height: size, 
              tintColor: theme.colors.completedtask 
            }}
          />
        )}
        style={styles.fabComplete}
        onPress={() => navigation.navigate("CompletedTask", { category: categoryname })}
      />

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        category={categoryname}
        refreshTasks={fetchTasks}
      />
    </View>
  );
}
