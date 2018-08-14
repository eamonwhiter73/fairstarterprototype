import {
  createStackNavigator,
} from 'react-navigation';

import BarcodeScanner from './components/BarcodeScanner';
import Inventory from './components/Inventory'
import EnterPrice from './components/EnterPrice'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import EditItem from './components/EditItem'


import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const App = createStackNavigator({
  LogIn: { screen: LogIn },
  SignUp: { screen: SignUp },
  Inventory: { screen: Inventory },
  BarcodeScanner: { screen: BarcodeScanner },
  EnterPrice: { screen: EnterPrice },
  EditItem: { screen: EditItem }
});

export default App;