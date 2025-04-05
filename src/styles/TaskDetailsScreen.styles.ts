import { StyleSheet } from 'react-native';
import { Theme } from './theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    fontSize: 18,
    padding: 8,
    color: theme.colors.text,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    padding: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: theme.colors.error,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  priorityText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
});



