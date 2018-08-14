import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, TouchableOpacity } from 'react-native';
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
      const { barcode, description, email, price, quantity } = doc.data();

      if(email == this.props.returnemail()) {
        items.push({
          key: doc.id,
          doc, // DocumentSnapshot
          barcode,
          description,
          email,
          price,
          quantity
        });
      }
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
          style={{paddingBottom: 1}}
          data={this.state.items}
          renderItem={({item}) => this.props.callback(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
   container: {
      justifyContent: 'center',
      alignItems: 'center',
   },
   button: {
      borderWidth: 1,
      padding: 10,
      borderColor: 'black',
      flex: 1,
      textAlign: 'center',
      color: 'blue',
      backgroundColor: '#aaa'
   }
})