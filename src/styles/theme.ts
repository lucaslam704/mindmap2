export const lightTheme = {
  colors: {
    primary: '#2196F3',    
    secondary: '#757575',  
    background: '#FFFFFF', 
    text: '#212121',      
    textSecondary: '#757575',
    cardBackground: '#F5F5F5',
    border: '#E0E0E0',
    error: '#FF5252',
    white: '#FFFFFF',
    lightBlue: '#rgb(24, 91, 207)',
    completedtask: '#rgb(255, 255, 255)',
    addtask: '#rgb(255, 255, 255)',
    
    // Priority colors
    highPriority: '#FF5252',    // Red
    mediumPriority: '#FFC107',  // Yellow
    lowPriority: '#4CAF50',     // Green
  },
  completeButton: {
    background: 'rgb(54, 194, 218)',
    color: '#FFFFFF',
  },
  deleteButton: {
    background: 'rgb(187, 45, 32)',
    color: '#FFFFFF',
  }
};

export const darkTheme = {
  colors: {
    primary: '#90CAF9',    
    secondary: '#9E9E9E',  
    background: '#121212', 
    text: '#FFFFFF',      
    textSecondary: '#B0B0B0',
    cardBackground: '#1E1E1E',
    border: '#2C2C2C',
    error: '#FF5252',
    white: '#FFFFFF',
    lightBlue: '#64B5F6', 
    completedtask: '#rgb(222, 222, 222)',
    addtask: '#rgb(222, 222, 222)',
    
    // Priority colors (slightly muted for dark mode)
    highPriority: '#CF4444',    // Darker Red
    mediumPriority: '#D4A304',  // Darker Yellow
    lowPriority: '#3D8B40',     // Darker Green
  },
  completeButton: {
    background: 'rgb(41, 151, 171)',
    color: '#FFFFFF',
  },
  deleteButton: {
    background: 'rgb(150, 36, 26)',
    color: '#FFFFFF',
  }
};

export type Theme = typeof lightTheme;

