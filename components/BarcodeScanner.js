import React from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, View, Alert, Permissions, Linking, TouchableOpacity, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import DeepLinking from 'react-native-deep-linking';

export default class BarcodeScanner extends React.Component {

  constructor() {
    super();
    this.state = {
      response: null,
      showCamera: true,
    };
    //this.ref = firebase.firestore().collection('items');
  }

  componentDidMount() {
    // firebase things?

    DeepLinking.addScheme('square-commerce-v1://');
    Linking.addEventListener('url', this.handleUrl);
 
    DeepLinking.addRoute('/payment/create?data=:id', (response) => {
      // example://test
      console.log(response + "   :::::::::: response");
      this.setState({ response });
    });
 
    /*Linking.getInitialURL().then((url) => {
      if (url) {
        console.log(url + " : : : : : : : URLSSSSSLLLLLL");
        Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));*/

  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleUrl);
  }

  handleUrl = ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }

  ifForSearch = () => {
    if(this.props.navigation.state.params.mode == 'forScanAdd') {
      return
    }

    if(this.props.navigation.state.params.mode != 'forSearch') {
      return (
        <View>
          <TouchableOpacity
            style = {styles.manualcontainer}
            onPress={() => {
              const { navigate } = this.props.navigation;
              if(this.props.navigation.state.params.mode == 'sell') {
                navigate('EnterSku', { mode: 'sell' });
              }
              else {
                //WILL NEVER BE REACHED! CLEAN UP!//
                navigate('EnterSku', { forFromPrice: this.props.navigation.state.params.forFromPrice, onNavigateBack: this.props.navigation.state.params.onNavigateBack});
              }
            }}
          >
            <Text style = {styles.button}>ENTER SKU</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style = {styles.manualcontainer}
            onPress={() => {
              const { navigate } = this.props.navigation;
              if(this.props.navigation.state.params.mode == 'sell') {
                navigate('EnterPrice', { mode: 'manual' });
              }
            }}
          >
            <Text style = {styles.button}>MANUAL SALE</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    if(this.state.showCamera) {
      return (
        <View style={styles.container}>
          <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style = {styles.preview}
              type={RNCamera.Constants.Type.back}
              //flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
              onBarCodeRead={this._handleBarCodeRead.bind(this)}
          />
          {this.ifForSearch()}
        </View>
      );
    }
    else {
        return (
            <View style={styles.containerdone}>
              <Text style={{marginTop: 15, marginLeft: 15, fontWeight: 'bold'}}>RETURN TO INVENTORY CONTROL!</Text>
            </View>
        );
    }
  }

  _handleBarCodeRead = ({ type, data }) => {
    this.setState({showCamera: false});
    //Alert.alert(`${type} and ${data}`);
    const { navigate } = this.props.navigation;
    price = "";

    if(this.props.navigation.state.params.mode == "sell") {

      firebase.firestore().collection("items").where("barcode", "==", `${data}`)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                price = doc.data().price;

                dataParameter = {
                  amount_money: {
                    amount: Number(price) * 100,
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

                var urlL = "";
                
                if(Platform.OS === 'ios') {
                  urlL = "square-commerce-v1://payment/create?data=" + encodeURIComponent(JSON.stringify(dataParameter));
                }
                else {
                  urlL = "square-commerce-v1://payment/"+Number(price)*100+"/"+doc.data().barcode;
                }

                Linking.openURL(urlL).then(() => {
                  navigate('Inventory');
                }).catch(err => console.log('There was an error:' + err));
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
    else if(this.props.navigation.state.params.mode == "forSearch") {
      navigate('Inventory', { skuForSearch: `${data}`, mode: "forSearch" });
    }
    else {
      navigate('EnterPrice', { forFromPrice: this.props.navigation.state.params.forFromPrice, onNavigateBack: this.props.navigation.state.params.onNavigateBack, data: data })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  containerdone: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  manualcontainer: {
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
      backgroundColor: '#aaa'
  }
});
