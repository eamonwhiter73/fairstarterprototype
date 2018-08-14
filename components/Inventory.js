import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import InventoryList from './InventoryList';

export default class Inventory extends React.Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('items');
    this.authSubscription = null;
  }

  static navigationOptions = {
    title: 'Inventory Control',
    headerLeft: null
  };

  state = {
    text: "__",
    price: "__",
    quantity: "",
    description: "",
    loading: true
  };

  changeData = (data) => {
    if (data != null) {
      this.setState({text: `${data}`})
    }
    else {
      this.setState({text: "__"})
    }
  }

  changePrice = (price) => {
    if (price != null) {
      this.setState({price: `${price}`})
    }
    else {
      this.setState({price: "__"})
    }
  }

  addItem() {
    this.ref.add({
      barcode: this.state.text,
      description: this.state.description,
      price: this.state.price,
      quantity: this.state.quantity,
      email: this.state.user.email
    });

    this.setState({
      text: "__",
      price: "__",
      quantity: "",
      description: ""
    });
  }

  submit = () => {
    if(this.state.text == '__' || this.state.description == "" || this.state.price == '__' || this.state.quantity == "" ) {
      Alert.alert("Please enter all information.")
    }
    else {
      this.addItem();
    }
  }

  componentDidMount() {
    // The user is an Object, so they're logged in
    if (!this.state.user) {
      const { navigate } = this.props.navigation;

      navigate('LogIn');
    }
  }

  componentWillMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  myCallback = (item) => {
    if (item.email == this.state.user.email) {
        return <View style={{flex: 1, flexDirection: 'row'}}><Text style={{marginTop: 10, flex: 0.8}}>SKU: {item.barcode} | Description: {item.description} | Quantity: {item.quantity} | Price: ${item.price}</Text><TouchableOpacity style = {styles.editcontainer} onPress={() => { /*this.submit()*/ }}><Text style = {styles.button}>EDIT</Text></TouchableOpacity></View>
    }
    else {
      return null
    }
  }
 
  returnEmail = () => {
    return this.state.user.email
  }

  render() {
    // The application is initialising
    if (this.state.loading) return null;

    return (
      <View style={{paddingTop: 15, paddingHorizontal: 15}}>
        <TouchableOpacity
          style = {styles.container}
          onPress={() => {
            const { navigate } = this.props.navigation;

            if(this.state.text != null) {
              navigate('BarcodeScanner', { onNavigateBack: this.changeData.bind(this), forFromPrice: this.changePrice.bind(this) })}
            }
          }
        >
          <Text style = {styles.button}>SCAN ITEM</Text>
        </TouchableOpacity>
        <Text style={{}}>{'\n'}Item #: {this.state.text} | Price: ${this.state.price}{"\n"}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 10}}>Description: </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 0.74, marginRight: 15, backgroundColor: '#ffffff'}}
            onChangeText={(text) => this.setState({description: text})}
            value={this.state.description}
          />
          <Text style={{marginTop: 10}}>Quantity: </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 0.26, backgroundColor: '#ffffff'}}
            onChangeText={(text) => this.setState({quantity: text})}
            value={this.state.quantity}
          />
        </View>
        <View style={{paddingTop: 15}}>
          <TouchableOpacity
            style = {styles.container}
            onPress={() => {
              this.submit()
            }}
          >
            <Text style = {styles.button}>ADD ITEM</Text>
          </TouchableOpacity>
        </View>
        <InventoryList callback={this.myCallback} returnemail={this.returnEmail}/>
        <TouchableOpacity
          style = {styles.sellcontainer}
          onPress={() => {
            const { navigate } = this.props.navigation;

            navigate('BarcodeScanner', { mode: "sell"})
          }}
        >
          <Text style = {styles.button}>SELL ITEM</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
   container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   sellcontainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15
   },
   editcontainer: {
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginTop: 10,
      flex: 0.2
   },
   button: {
      borderWidth: 1,
      padding: 10,
      borderColor: 'black',
      flex: 1,
      textAlign: 'center',
      color: 'blue',
      backgroundColor: '#aaa'
   },
})