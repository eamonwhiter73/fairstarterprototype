import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

export default class EnterPrice extends React.Component {

  static navigationOptions = {
    title: 'Enter Price',
  };

  state = {
    text: "",
  };

  submitEdit = () => {
    const { navigate } = this.props.navigation;
    

    this.props.navigation.state.params.forFromPrice(this.state.text);
    
    if(this.props.navigation.state.params.mode != "fromEnterSku") {
      this.props.navigation.state.params.onNavigateBack(`${this.props.navigation.state.params.data}`);
    }
    else {
      this.props.navigation.state.params.onNavigateBack(this.props.navigation.state.params.sku);
    }
    
    navigate('Inventory', { mode: "fromPrice" });
  }

  render() {
    return (
      <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
        <Text style={{marginTop: 25}}>Price: </Text>
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