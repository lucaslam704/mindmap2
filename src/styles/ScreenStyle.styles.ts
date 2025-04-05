import { StyleSheet } from 'react-native';
import { Theme } from './theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
    backgroundColor: theme.colors.background,
  },
  taskItem: {
    padding: 16,
    backgroundColor: theme.colors.cardBackground,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '600',
  },
  taskInfo: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  listContainer: {
    paddingBottom: 80,
  },
  fabAdd: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.secondary,
  },
  fabComplete: {
    position: "absolute",
    left: 16,
    bottom: 16,
    backgroundColor: theme.colors.secondary,
  },
  button: {
    borderRadius: 8,
  },
  buttonText: {
    color: theme.colors.white,
  }
});

