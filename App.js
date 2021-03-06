import {
  createStackNavigator,
} from 'react-navigation';

import BarcodeScanner from './components/BarcodeScanner';
import Inventory from './components/Inventory';
import EnterPrice from './components/EnterPrice';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import EditItem from './components/EditItem';
import EnterSku from './components/EnterSku';



import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const App = createStackNavigator({
  Inventory: { screen: Inventory },
  LogIn: { screen: LogIn },
  SignUp: { screen: SignUp },
  BarcodeScanner: { screen: BarcodeScanner },
  EnterPrice: { screen: EnterPrice },
  EnterSku: { screen: EnterSku },
  EditItem: { screen: EditItem }
});

export default App;