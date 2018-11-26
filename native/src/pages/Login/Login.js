import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground, Platform, KeyboardAvoidingView, Text
} from 'react-native';
import { Container, Content, Form, Item, Input, Button, Label,} from 'native-base';
import styles from "./styles";
import DeviceInfo from 'react-native-device-info';
import { images } from '../../assets/images/images';
import Icon from  'react-native-vector-icons/FontAwesome';
import DismissKeyboard from '../../common/components/dissmissKeyboard';
import { TextField } from "react-native-material-textfield";
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import { isValidNumber } from "libphonenumber-js";
import Spinner from 'react-native-loading-spinner-overlay';
import SplashScreen from 'react-native-splash-screen';
import Navigation from '../../common/services/navigation';
import FireAuth from '../../common/services/fireAuth';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';


export default class Login extends Component {
  componentDidMount() {
    loc(this);
  }
  
  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);
    let userLocaleCountryCode = DeviceInfo.getDeviceCountry();
    const userCountryData = '';
    let callingCode = "";
    let cca2 = userLocaleCountryCode;
        if (!cca2 || !userCountryData) {
          cca2 = "IN";
          callingCode = "91";
        } else {
          callingCode = userCountryData.callingCode;
        }
    this.state = {
      cca2,
      callingCode,
      countryName:'India',
      phone: "",
      error: "",
      loadMSG:'',
      spinner: false,
    };

    this.navigation = new Navigation();
    this.fireAuth = new FireAuth();
    

  }

  _loginValidations = (phone) => {
    let res={}
    if (phone && isValidNumber(phone)) {
      res['success']= true;
      res['phone']=phone
    } else {
      {
        phone
          ? isValidNumber(phone)
            ? undefined
            : res['error'] = "Invalid phone number"
          : res['error'] = "Phone number required"
      }
    }
    return res;
  };


  _doLogin = () => {
    this.setState({ spinner: true, loadMSG:'Sending OTP' });
    let response = this._loginValidations(this.state.phone); 
    if(response && response.error){
        this.setState({ error: response.error, spinner: false })
      }else if(response && response.success){
         this.firebaseLogin(response.phone);
      }
  };


  firebaseLogin = (phone) => {
    this.fireAuth.confirmPhone(phone).then((result)=>{
        this.setState({spinner: false})
        this.props.navigation.navigate("Otp",{
          cnfResult:result,
          mobile:phone
        });   
    }).catch((err)=>{
      console.log(err);
      this.setState({ error: 'Something went wrong. Please try again !!', spinner: false });
    })
  }

  _onPhoneValueChange(phone) {
    this.setState({ phone });
    this.setState({ error: "" });
    let response = this._loginValidations(phone)
    if(response && response.error){
      this.setState({ error: response.error })
    }
  }

  render() {
    return (
      <DismissKeyboard>
      <ImageBackground source={images.backgroundImage.uri} style={styles.backgroundImage}> 
      <KeyboardAvoidingView style={styles.container} >
        <View style={styles.container}>   
        <Spinner
          visible={this.state.spinner}
          textContent={this.state.loadMSG}
          textStyle={{color:'#FFF',fontSize:12}}
        /> 
        <Content>
          <View>
              <Image source={images.logo.uri} resizeMode = 'cover'  style={[styles.upperlogo]} /> 
          </View>  
          <Form style={styles.loginForm}>
          <View style={styles.bgicon}>
             <Image style={styles.logo} source={images.logo.uri} /> 
          </View>
          <View style={{padding:30}}>
          <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
        
          <Button transparent block primary style={{alignItems:'flex-start', justifyContent:'flex-start', padding:10, borderBottomWidth: 0.5, borderBottomColor: '#fff', marginBottom:10}}
              onPress={()=> this.countryPicker.openModal()}
            >
              <CountryPicker
                  ref={(ref) => { this.countryPicker = ref; }}
                  onChange={value => {
                    this.setState({ cca2: value.cca2, callingCode: value.callingCode, countryName: value.name  });
                  }}
                  cca2={this.state.cca2}
                  closeable
                  filterable
                  showCallingCode
                  styles={{fontSize:30}}
              />
                <Text style={{fontSize:20, marginLeft:10, color:'#fff', paddingBottom:10}}>{this.state.countryName}</Text>
              </Button>
          </View>
         
            <TextField style={styles.labelalign}
                label="Phone number"
                onChangeText={phone => this._onPhoneValueChange(phone != '' ? `+${this.state.callingCode}${phone}`: '')}
                prefix={`+${this.state.callingCode}`}
                error={this.state.error}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                labelFontSize={20}
                labelPadding={15}
                fontSize={20}
                inputContainerPadding={10}
                tintColor="#2979ff"
                baseColor="#FFF"
                textColor="#ddd"
                returnKeyType='send'
                onSubmitEditing={phone => this._doLogin()}
              />
            </View>
          </Form>
          
          <View style={styles.pagination}>
          <Icon name="circle" style={styles.iconstyle} />       
          <Icon name="circle" style={styles.hide} />
          </View>
        </Content>
      </View>
      </KeyboardAvoidingView>
      </ImageBackground>
      </DismissKeyboard>
    );
  }
}