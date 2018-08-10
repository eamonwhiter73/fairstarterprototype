import React from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, View, Alert, Permissions } from 'react-native';

export default class BarcodeScanner extends React.Component {

  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {
    // firebase things?
  }

  render() {
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
      </View>
    );
  }

  _handleBarCodeRead = ({ type, data }) => {
    //Alert.alert(`${type} and ${data}`);
    const { navigate } = this.props.navigation;
    navigate('EnterPrice', { forFromPrice: this.props.navigation.state.params.forFromPrice, onNavigateBack: this.props.navigation.state.params.onNavigateBack, data: data })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});
