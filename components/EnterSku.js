import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Linking } from 'react-native';
import firebase from 'react-native-firebase';

export default class EnterSku extends React.Component {

  static navigationOptions = {
    title: 'Enter SKU',
  };

  state = {
    text: "",
  };

  submitEdit = () => {
    const { navigate } = this.props.navigation;

    if(this.props.navigation.state.params.mode == 'sell') {

      firebase.firestore().collection("items").where("barcode", "==", this.state.text)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                price = doc.data().price;

                dataParameter = {
                  amount_money: {
                    amount:        Number(price) * 100,
                    currency_code: "USD",
                  },

                  // Replace this value with your application's callback URL
                  callback_url: "https://fairstarter.eamondev.com/callback.html",

                  // Replace this value with your application's ID
                  client_id: "sq0idp-vHgDfd4SSLvkgAqfjZpwEg",

                  version: "1.3",
                  notes: doc.data().barcode,
                  options: {
                    supported_tender_types: ["CREDIT_CARD","CASH","OTHER","SQUARE_GIFT_CARD","CARD_ON_FILE"],
                  }
                };
                
                Linking.openURL("square-commerce-v1://payment/create?data=" + encodeURIComponent(JSON.stringify(dataParameter))).then(() => {
                  navigate('Inventory');
                }).catch(err => console.log('There was an error:' + err));
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
    else {
      navigate('EnterPrice', { onNavigateBack: this.props.navigation.state.params.onNavigateBack, forFromPrice: this.props.navigation.state.params.forFromPrice, sku: this.state.text, mode: "fromEnterSku" });
    }
  }

  render() {
    return (
      <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
        <Text style={{marginTop: 25}}>SKU: </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 1, marginTop: 15, backgroundColor: '#ffffff'}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          onSubmitEditing={this.submitEdit}
        />
      </View>
    );
  }
}