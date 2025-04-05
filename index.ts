import { registerRootComponent } from 'expo';
import App from './App';

// Remove the process.on code since it's not available in React Native
registerRootComponent(App);