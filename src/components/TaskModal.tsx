import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addTask } from "../services/firestoreService";
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/ScreenStyle.styles';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  refreshTasks: () => Promise<void>;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose, category, refreshTasks }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: undefined as Date | undefined,
  });
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

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

  

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ backgroundColor: theme.colors.cardBackground, padding: 20, borderRadius: 10 }}>
          <TextInput
            placeholder="Task Title"
            value={task.title}
            onChangeText={(text) => setTask({ ...task, title: text })}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Task Description"
            value={task.description}
            onChangeText={(text) => setTask({ ...task, description: text })}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <RNPickerSelect
            onValueChange={(value) => setTask({ ...task, priority: value })}
            items={[{ label: "Low", value: "Low" }, { label: "Medium", value: "Medium" }, { label: "High", value: "High" }]}
          />

            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginBottom: 10 }}>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={{ flex: 1 }}>
                <Text style={{ fontSize: 18 }}>
                {task.dueDate ? task.dueDate.toLocaleString() : "No due date"}
                </Text>
            </TouchableOpacity>

            {task.dueDate && (
                <TouchableOpacity 
                onPress={() => setTask({ ...task, dueDate: undefined })} 
                style={{ padding: 5 }}
                >
                <Text style={{ fontSize: 18, color: 'red' }}>✕</Text>
                </TouchableOpacity>
            )}
            </View>

          <View style={{ gap: 10 }}>
            <Button 
              buttonColor="rgb(24, 91, 207)"
              mode="contained" 
              onPress={handleSave}
            >
              Add Task
            </Button>
            
            <Button
              mode="outlined"
              onPress={onClose}
              textColor={theme.colors.white}
              buttonColor="red"
              style={{
                borderColor: theme.colors.error
              }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
      {datePickerVisible && (
        <DateTimePicker
          value={task.dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setDatePickerVisible(false);
            if (selectedDate) {
              setTempDate(selectedDate);
              setTimePickerVisible(true);
            }
          }}
        />
      )}
      {timePickerVisible && (
        <DateTimePicker
          value={tempDate || new Date()}
          mode="time"
          display="default"
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

export default TaskModal;
