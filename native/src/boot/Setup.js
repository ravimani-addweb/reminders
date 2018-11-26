import React, { Component } from 'react';
import { AsyncStorage } from "react-native";
import Navigation from '../common/services/navigation';
import { NavigationActions, StackActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'

export default class Setup extends Component {
  constructor(props) {
    super(props);
    this.navigation = new Navigation();
  }

  reset = (route) => {
    let resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: route})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  componentDidMount() {
    SplashScreen.hide();
    AsyncStorage.getItem('isLogged', (err, result) => {
      if(result){
        this.navigation.setRoot('Drawer', JSON.parse(result),this.props);
      } else{
        this.navigation.setRoot('Login',{},this.props)
      }
      
    });
  }

  componentWillMount() {
   
  }

  render() {
      return null;
  }

}
