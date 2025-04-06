import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, Platform, StyleSheet, FlatList } from "react-native";
import { Button } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addTask } from "../services/firestoreService";
import { useTheme } from '../context/ThemeContext';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  refreshTasks: () => Promise<void>;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose, category, refreshTasks }) => {
  const { theme } = useTheme();
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: undefined as Date | undefined,
  });
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);

  const priorityItems = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" }
  ];

  const handleSave = async () => {
    if (!task.title) return;

    const taskToAdd = {
      ...task,
      category,
      completed: false
    };

    await addTask(taskToAdd);

    onClose();
    await refreshTasks();
    setTask({ title: "", description: "", priority: "Medium", dueDate: undefined });
  };

  const selectPriority = (value: string) => {
    setTask({ ...task, priority: value });
    setPriorityModalVisible(false);
  };

  const renderPrioritySelector = () => {
    if (Platform.OS === 'ios') {
      return (
        <>
          <TouchableOpacity 
            onPress={() => setPriorityModalVisible(true)}
            style={[styles.datePickerButton, { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background
            }]}
          >
            <Text style={{ color: theme.colors.text }}>
              Priority: {task.priority}
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
                        color: theme.colors.text,
                        fontWeight: task.priority === item.value ? 'bold' : 'normal'
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
        <View style={[styles.pickerContainer, { borderColor: theme.colors.border }]}>
          <RNPickerSelect
            onValueChange={(value) => setTask({ ...task, priority: value })}
            items={priorityItems}
            value={task.priority}
            style={{
              inputIOS: {
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 4,
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              },
              inputAndroid: {
                fontSize: 16,
                paddingVertical: 8,
                paddingHorizontal: 10,
                color: theme.colors.text,
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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
          <TextInput
            placeholder="Task Title"
            value={task.title}
            onChangeText={(text) => setTask({ ...task, title: text })}
            style={{ 
              borderWidth: 1,
              borderRadius: 4,
              padding: 12,
              marginBottom: 16,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }}
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TextInput
            placeholder="Task Description"
            value={task.description}
            onChangeText={(text) => setTask({ ...task, description: text })}
            multiline
            numberOfLines={4}
            style={{ 
              borderWidth: 1,
              borderRadius: 4,
              padding: 12,
              marginBottom: 16,
              color: theme.colors.text,
              borderColor: theme.colors.border,
              height: 100,
              textAlignVertical: 'top'
            }}
            placeholderTextColor={theme.colors.textSecondary}
          />

          {renderPrioritySelector()}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 4,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
            marginBottom: 16,
          }}>
            <TouchableOpacity 
              onPress={() => setDatePickerVisible(true)}
              style={{
                flex: 1,
                padding: 12,
              }}
            >
              <Text style={{ color: theme.colors.text }}>
                {task.dueDate ? task.dueDate.toLocaleString() : "Select Due Date"}
              </Text>
            </TouchableOpacity>
            {task.dueDate && (
              <TouchableOpacity 
                onPress={() => setTask({ ...task, dueDate: undefined })} 
                style={{ padding: 5, marginRight: 5 }}
              >
                <Text style={{ fontSize: 18, color: 'red' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ gap: 10, marginTop: 20 }}>
            <Button 
              mode="contained"
              onPress={handleSave}
              buttonColor={theme.colors.lightBlue}
              textColor={theme.colors.white}
            >
              Add Task
            </Button>
            <Button
              mode="outlined"
              onPress={onClose}
              textColor={theme.colors.error}
              style={{
                borderColor: theme.colors.error
              }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>

      {/* iOS Date Picker */}
      {Platform.OS === 'ios' && datePickerVisible && (
        <Modal transparent={true} animationType="slide" visible={datePickerVisible}>
          <View style={styles.datePickerModalContainer}>
            <View style={[styles.datePickerContent, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={{ backgroundColor: theme.colors.background, borderRadius: 10, overflow: 'hidden' }}>
                <DateTimePicker
                  value={task.dueDate || new Date()}
                  mode="datetime"
                  display="spinner"
                  textColor={theme.colors.text}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setTask({ ...task, dueDate: selectedDate });
                  }}
                  style={{ height: 200 }}
                />
              </View>
              <View style={styles.datePickerButtons}>
                <Button
                  onPress={() => setDatePickerVisible(false)}
                  mode="contained"
                  buttonColor={theme.colors.lightBlue}
                  style={{ marginTop: 10 }}
                >
                  Done
                </Button>
                <Button
                  onPress={() => setDatePickerVisible(false)}
                  mode="outlined"
                  textColor={theme.colors.error}
                  style={{ marginTop: 10 }}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android Pickers */}
      {Platform.OS === 'android' && datePickerVisible && (
        <DateTimePicker
          value={task.dueDate || new Date()}
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
              setTask({ ...task, dueDate: combinedDateTime });
            }
          }}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  datePickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  datePickerContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  datePickerButtons: {
    flexDirection: 'column',
    gap: 10,
  },
});

export default TaskModal;
