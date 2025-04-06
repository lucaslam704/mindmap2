  import React, { useState } from "react";
  import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Platform, StyleSheet } from "react-native";
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
    const [priorityModalVisible, setPriorityModalVisible] = useState(false);

    const priorityItems = [
      { label: "High", value: "High" },
      { label: "Medium", value: "Medium" },
      { label: "Low", value: "Low" }
    ];

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

    const selectPriority = (value: string) => {
      setPriority(value);
      setPriorityModalVisible(false);
    };

    const renderPrioritySelector = () => {
      if (Platform.OS === 'ios') {
        return (
          <>
            <TouchableOpacity 
              onPress={() => setPriorityModalVisible(true)}
              disabled={fromCompleted}
              style={[
                styles.pickerContainer, 
                { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background,
                  padding: 12,
                  borderWidth: 1,
                  borderRadius: 4,
                }
              ]}
            >
              <Text style={{ color: getPriorityColor(priority) }}>
                Priority: {priority}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={priorityModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setPriorityModalVisible(false)}
            >
              <View style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}>
                <View style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                }}>
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: 'bold', 
                    marginBottom: 15,
                    color: theme.colors.text
                  }}>
                    Select Priority
                  </Text>
                
                  <FlatList
                    data={priorityItems}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          paddingVertical: 15,
                          borderBottomWidth: 1,
                          borderBottomColor: theme.colors.border
                        }}
                        onPress={() => selectPriority(item.value)}
                      >
                        <Text style={{ 
                          color: getPriorityColor(item.value),
                          fontWeight: priority === item.value ? 'bold' : 'normal'
                        }}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                
                  <Button
                    mode="text"
                    onPress={() => setPriorityModalVisible(false)}
                    style={{ marginTop: 10 }}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </Modal>
          </>
        );
      } else {
        return (
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              value={priority}
              onValueChange={(value) => setPriority(value)}
              items={priorityItems}
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
              useNativeAndroidPickerStyle={false}
            />
          </View>
        );
      }
    };

    const renderDatePicker = () => {
      return (
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity 
            onPress={() => setDatePickerVisible(true)} 
            disabled={fromCompleted}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
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
      );
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
      
        {renderPrioritySelector()}

        {renderDatePicker()}

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

        {Platform.OS === 'ios' && datePickerVisible && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={datePickerVisible}
          >
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
              <View style={{ 
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: theme.colors.cardBackground 
              }}>
                <View style={{ 
                  backgroundColor: theme.colors.background,
                  borderRadius: 10,
                  overflow: 'hidden'
                }}>
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="datetime"
                    display="spinner"
                    textColor={theme.colors.text}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setDueDate(selectedDate);
                      }
                    }}
                    style={{ height: 200 }}
                  />
                </View>
                <View style={{
                  flexDirection: 'column',
                  gap: 10,
                  marginTop: 10
                }}>
                  <Button
                    onPress={() => setDatePickerVisible(false)}
                    mode="contained"
                    buttonColor={theme.colors.lightBlue}
                  >
                    Done
                  </Button>
                  <Button
                    onPress={() => setDatePickerVisible(false)}
                    mode="outlined"
                    textColor={theme.colors.error}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {Platform.OS === 'android' && datePickerVisible && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            onChange={(event, selectedDate) => {
              setDatePickerVisible(false);
              if (selectedDate) {
                setTempDate(selectedDate);
                setTimePickerVisible(true);
              }
            }}
          />
        )}

        {Platform.OS === 'android' && timePickerVisible && (
          <DateTimePicker
            value={tempDate || new Date()}
            mode="time"
            onChange={(event, selectedTime) => {
              setTimePickerVisible(false);
              if (selectedTime && tempDate) {
                const combinedDateTime = new Date(tempDate);
                combinedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
                setDueDate(combinedDateTime);
              }
            }}
          />
        )}
      </View>
    );
  }
