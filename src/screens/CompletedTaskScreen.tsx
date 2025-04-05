import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { getTasks, TaskType } from "../services/firestoreService";
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/ScreenStyle.styles';

export default function CompletedTaskScreen() {
  const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  // Add a safety check for route.params
  const category = route.params && 'category' in route.params 
    ? (route.params as { category: string }).category 
    : "";

  useFocusEffect(
    useCallback(() => {
      fetchCompletedTasks();
    }, [])
  );
      
  useEffect(() => {
    if (category) {
      fetchCompletedTasks();
    } else {
      console.error("No category provided to CompletedTaskScreen");
    }
  }, [category]);

  const fetchCompletedTasks = async () => {
    const data = await getTasks();
    setCompletedTasks(data ? data.filter((task) => task.category === category && task.completed) : []);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!category ? (
        <Text style={[styles.taskTitle, { textAlign: 'center', marginTop: 20 }]}>
          No category specified
        </Text>
      ) : (
        <FlatList
          data={completedTasks}
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
              onPress={() => navigation.navigate("TaskDetails", { task: item, fromCompleted: true })}
            >
              <Text 
                style={[
                  styles.taskTitle, 
                  { 
                    color: theme.colors.text,
                    textDecorationLine: "line-through"
                  }
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
