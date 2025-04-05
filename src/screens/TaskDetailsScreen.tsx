
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateTask, deleteTask, TaskType } from "../services/firestoreService";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createStyles } from '../styles/TaskDetailsScreen.styles';
import { useTheme } from '../context/ThemeContext';

export default function TaskDetailsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const navigation = useNavigation();
  const { task, fromCompleted } = route.params as { task: TaskType; fromCompleted: boolean };
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(dueDate);

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

  const handleSave = async () => {
    await updateTask(task.id, { title, description, priority, dueDate });
    navigation.goBack();
  };

  const handleUndo = async () => {
    await updateTask(task.id, { completed: false });
    navigation.goBack();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    navigation.goBack();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      setTimePickerVisible(true); // Show time picker after date selection
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setTimePickerVisible(false);
    if (selectedTime && tempDate) {
      const combinedDateTime = new Date(tempDate);
      combinedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDueDate(combinedDateTime);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { color: theme.colors.text }]}
        editable={!fromCompleted}
        placeholderTextColor={theme.colors.textSecondary}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { color: theme.colors.text }]}
        editable={!fromCompleted}
        placeholderTextColor={theme.colors.textSecondary}
      />
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          value={priority}
          onValueChange={(value) => setPriority(value)}
          items={[
            { label: "Low", value: "Low" },
            { label: "Medium", value: "Medium" },
            { label: "High", value: "High" }
          ]}
          disabled={fromCompleted}
          style={{
            inputIOS: {
              color: getPriorityColor(priority),
              fontSize: 16,
              paddingVertical: 8,
            },
            inputAndroid: {
              color: getPriorityColor(priority),
              fontSize: 16,
              paddingVertical: 8,
            },
            placeholder: {
              color: theme.colors.textSecondary,
            }
          }}
          placeholder={{ label: "Select Priority", value: null }}
        />
      </View>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={() => setDatePickerVisible(true)} disabled={fromCompleted}>
          <Text style={styles.dateTimeText}>
            Due Date: {dueDate ? dueDate.toLocaleString() : "No due date"}
          </Text>
        </TouchableOpacity>
        {dueDate && !fromCompleted && (
          <TouchableOpacity onPress={() => setDueDate(undefined)} style={{ padding: 5 }}>
            <Text style={{ fontSize: 18, color: 'red' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {datePickerVisible && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      {timePickerVisible && (
        <DateTimePicker
          value={tempDate || new Date()}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        {fromCompleted ? (
          <>
            <Button 
            mode="contained"  
            onPress={handleUndo}
            buttonColor="rgb(24, 91, 207)"
            >
              Undo
            </Button>
            <Button 
              mode="contained" 
              onPress={handleDelete} 
              style={styles.deleteButton}
              buttonColor="red"
            >
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button buttonColor="rgb(24, 91, 207)" mode="contained" onPress={handleSave}>Save Changes</Button>
            <Button 
              mode="contained" 
              onPress={() => navigation.goBack()} 
              style={styles.deleteButton}
            >
              Cancel
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
