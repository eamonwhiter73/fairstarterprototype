import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Alert } from 'react-native';
import firebase from 'react-native-firebase';


export default class EditItem extends React.Component {

  static navigationOptions = {
    title: 'Edit Item',
  };

  constructor() {
    super();
    this.state = {
      sku: "",
      description: "",
      price: "",
      quantity: ""
    };
  }

  componentDidMount() {
    this.setState({
      sku: this.props.navigation.state.params.sku,
      description: this.props.navigation.state.params.description,
      price: this.props.navigation.state.params.price,
      quantity: this.props.navigation.state.params.quantity
    })
  }

  updateInventory = () => {

    if(this.state.description != null && this.state.quantity != null && this.state.price != null) {
      Alert.alert(
        'SAVING',
        'Are you sure you want to save this information?',
        [
          {text: 'Cancel', onPress: () => {
            navigate('Inventory');
          }},
          {text: 'OK', onPress: () => {

            const ref = firebase.firestore().collection('items').where("barcode", "==", this.state.sku);

            ref.onSnapshot((snap) => {
              console.log(snap);

              snap._docs[0]._ref.update({
                  description: this.state.description,
                  price: this.state.price,
                  quantity: this.state.quantity
              });

              /*firebase
              .firestore()
              .runTransaction(async transaction => {
                const doc = await transaction.get(ref);

                transaction.update(snap._docs[0]._ref, {
                  description: this.state.description,
                  price: this.state.price,
                  quantity: this.state.quantity
                });

                // return the new value so we know what the new population is
              })
              .then(() => {
                console.log(
                  "Successfully done."
                );
              })
              .catch(error => {
                console.log('Transaction failed: ', error);
              });*/
            });
            
            
          }},
        ],
        { cancelable: false }
      )
    }
  }
  

  render() {
    return (
      <View style={{paddingHorizontal: 15}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 25}}>Description: </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 1, marginTop: 15, backgroundColor: '#ffffff'}}
            onChangeText={(text) => this.setState({description: text})}
            value={this.state.description}
            placeholder={this.state.description}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 25}}>Price: </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 1, marginTop: 15, backgroundColor: '#ffffff'}}
            onChangeText={(text) => this.setState({price: text})}
            value={this.state.price}
            placeholder={this.state.price}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 25}}>Quantity: </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 1, marginTop: 15, backgroundColor: '#ffffff'}}
            onChangeText={(text) => this.setState({quantity: text})}
            value={this.state.quantity}
            placeholder={this.state.quantity}
          />
        </View>
        <TouchableOpacity
          style = {styles.container}
          onPress={() => {
            this.updateInventory()
          }}
        >
          <Text style = {styles.button}>SAVE</Text>
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
   button: {
      borderWidth: 1,
      padding: 10,
      borderColor: 'black',
      flex: 1,
      textAlign: 'center',
      color: 'blue',
      backgroundColor: '#aaa',
      marginTop: 15
   },
})