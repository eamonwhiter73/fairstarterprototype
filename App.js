import {
  createStackNavigator,
} from 'react-navigation';

import BarcodeScanner from './components/BarcodeScanner';
import Inventory from './components/Inventory'
import EnterPrice from './components/EnterPrice'

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const App = createStackNavigator({
  Inventory: { screen: Inventory },
  BarcodeScanner: { screen: BarcodeScanner },
  EnterPrice: { screen: EnterPrice }
});

export default App;