import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import firebase from 'react-native-firebase';

export default class InventoryList extends React.Component {

  state = {
    items: [],
    loading: true,
  };

  constructor() {
    super();
    this.ref = firebase.firestore().collection('items');
    this.unsubscribe = null;
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate) 
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const items = [];

    querySnapshot.forEach((doc) => {
      const { barcode, description, price, quantity } = doc.data();
      items.push({
        key: doc.id,
        doc, // DocumentSnapshot
        barcode,
        description,
        price,
        quantity
      });
    });

    this.setState({ 
      items,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return null; // or render a loading icon
    }

    return (
      <View style={{marginTop: 15}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 1, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 16, textAlign: 'center'}}>Added Items</Text>
        </View>
        <FlatList
          data={this.state.items}
          renderItem={({item}) => <Text style={{marginTop: 10}}>SKU: {item.barcode} | Description: {item.description} | Quantity: {item.quantity} | Price: ${item.price}</Text>}
        />
      </View>
    );
  }
}