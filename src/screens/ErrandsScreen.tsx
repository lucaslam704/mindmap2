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

export default function ErrandsScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<'none' | 'newest' | 'due' | 'priority'>('none');
  const navigation = useNavigation<any>();
  const categoryname = "Errands";
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

  const getSortedTasks = () => {
    const activeTasks = tasks.filter(task => !task.completed);
    switch (filter) {
      case 'newest':
        return [...activeTasks].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      case 'due':
        return [...activeTasks].sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));
      case 'priority':
        const priorityOrder: Record<'High' | 'Medium' | 'Low', number> = {
          High: 1,
          Medium: 2,
          Low: 3
        };
        return [...activeTasks].sort((a, b) =>
          priorityOrder[a.priority as 'High' | 'Medium' | 'Low'] -
          priorityOrder[b.priority as 'High' | 'Medium' | 'Low']
        );
      default:
        return activeTasks;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {[
          { label: 'No Filter', value: 'none' },
          { label: 'Newest', value: 'newest' },
          { label: 'Due Date', value: 'due' },
          { label: 'Priority', value: 'priority' },
        ].map(option => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setFilter(option.value as any)}
            style={{
              backgroundColor: filter === option.value ? theme.colors.primary : theme.colors.cardBackground,
              padding: 8,
              borderRadius: 6,
              marginRight: 6,
              marginBottom: 6,
              borderWidth: 1,
              borderColor: filter === option.value ? theme.colors.primary : theme.colors.border
            }}
          >
            <Text style={{ color: filter === option.value ? '#fff' : theme.colors.text }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getSortedTasks()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.taskItem, {
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.border
            }]}
            onPress={() => navigation.navigate('TaskDetails', { task: item })}
          >
            <Text style={[styles.taskTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.taskInfo, { color: getPriorityColor(item.priority) }]}>Priority: {item.priority}</Text>
            <Text style={[styles.taskInfo, { color: theme.colors.textSecondary }]}>
              Due Date: {item.dueDate ? item.dueDate.toLocaleString() : "No due date"}
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
        icon={({ size }) => (
          <Image 
            source={require('../../public/images/AddTask.png')} 
            style={{ width: size, height: size, tintColor: theme.colors.addtask }}
          />
        )}
        style={styles.fabAdd}
        onPress={() => setModalVisible(true)}
      />

      <FAB 
        icon={({ size }) => (
          <Image 
            source={require('../../public/images/CompletedTask.png')} 
            style={{ width: size, height: size, tintColor: theme.colors.completedtask }}
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
