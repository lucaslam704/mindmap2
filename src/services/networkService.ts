import NetInfo from '@react-native-community/netinfo';
import { db } from '../../firebaseConfig';
import { disableNetwork, enableNetwork } from 'firebase/firestore';

class NetworkService {
  private static instance: NetworkService;
  private isOnline: boolean = true;
  private listeners: ((isOnline: boolean) => void)[] = [];

  private constructor() {
    this.setupNetworkListener();
  }

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const newOnlineState = state.isConnected ?? false;
      if (this.isOnline !== newOnlineState) {
        this.isOnline = newOnlineState;
        this.handleConnectionChange(newOnlineState);
        this.notifyListeners();
      }
    });
  }

  private async handleConnectionChange(isOnline: boolean) {
    try {
      if (isOnline) {
        await enableNetwork(db);
        console.log('Network connection enabled');
      } else {
        await disableNetwork(db);
        console.log('Network connection disabled');
      }
    } catch (error) {
      console.error('Error handling connection change:', error);
    }
  }

  public addListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (isOnline: boolean) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public isNetworkOnline(): boolean {
    return this.isOnline;
  }
}

export const networkService = NetworkService.getInstance();