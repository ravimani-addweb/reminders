import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground, KeyboardAvoidingView, Platform, AsyncStorage } from 'react-native';
import { Content } from 'native-base';
import styles from "../Login/styles";
import Navigation from '../../common/services/navigation';
import { images } from '../../assets/images/images';
import Icon from  'react-native-vector-icons/FontAwesome';
import CodeInput from 'react-native-confirmation-code-input';
import GestureRecognizer from 'react-native-swipe-gestures';
import DismissKeyboard from '../../common/components/dissmissKeyboard';
import Spinner from 'react-native-loading-spinner-overlay';
import EventEmitter from "react-native-eventemitter";
import FireAuth from '../../common/services/fireAuth';

import ToastMSG from '../../common/services/toast';

export default class Otp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobilenumber: this.props.navigation.getParam('mobile'),
            confirmResult: this.props.navigation.getParam('cnfResult'),
            otp: '',
            error:'',
            spinner: false,
            loadMSG:''
        }
        this.navigation = new Navigation();
        this.fireAuth = new FireAuth();
        this.toast = new ToastMSG();
    }

    componentWillMount() {
        EventEmitter.on("auth_changed", (value)=>{
          this.getResult(value);
        });
    }
  
    getResult(result){
        if(result.state == 'verified') {
          AsyncStorage.setItem('isLogged',"true");         
          this.setState({ spinner: true, loadMSG:'Auto verifying OTP' });
          setTimeout(() => {
            this.setState({spinner: false, loadMSG: ''});
            //this.toast.addToast("Login successfully !!");
            this.navigation.setRoot('Drawer',{}, this.props);
          },2000);
        }
    }

    resendOTP = () => {
        this.refs.OTPcode.clear();
        this.setState({ spinner: true,  loadMSG:'Resending OTP', error:''});  

        this.fireAuth.confirmPhone(this.state.mobilenumber).then((confirmResult)=>{
              this.setState({ confirmResult, spinner: false });   
              this.toast.addToast("OTP has been sent successfully.")
          }).catch((err)=>{
            console.log(err);
            this.setState({ error: 'Something went wrong. Tap below to re-send the OTP or swipe left to enter other mobile number.', spinner: false });
          })
    }

    checkingOTP = (verificationCode) => {
        this.setState({ spinner: true, error:'' });
        this.fireAuth.confirmCode(this.state.confirmResult.verificationId,verificationCode).then((result)=>{
            console.log(result);
            this.setState({ spinner: false });
            AsyncStorage.setItem('isLogged',"true");     
            //this.toast.addToast("Login successfully !!");   
            this.navigation.setRoot('Drawer',{}, this.props);
        }).catch((err) => {
            console.log(err);
            this.setState({ error: 'Invalid OTP. Tap below to re-send the OTP or swipe left to enter other mobile number.', spinner: false })
        })
    }

    render () {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          };
      
        return (
            <GestureRecognizer
            onSwipeDown={(state) => {}}
            onSwipeLeft={(state) => {}}
            onSwipeRight={(state) => this.props.navigation.navigate('Login')}
            config={config}
        >          
        <DismissKeyboard>
                <ImageBackground source={images.backgroundImage.uri} style={styles.backgroundImage}> 
                <KeyboardAvoidingView style={styles.container}>
                <View style={styles.container}>
                <Spinner 
                    visible={this.state.spinner}
                    textContent={this.state.loadMSG}
                    textStyle={{color:'#FFF',fontSize:12}}
                />
                    <Content>
                    <View style={styles.bgicon}>
                        <Image style={styles.logo} source={images.logo.uri} /> 
                    </View>
                        <View style={styles.otpmsg}>
                            <Text style={styles.msgstyle}>Verifying your number! </Text>
                            <Text style={styles.msgstyle}>We have sent an OTP on your number {this.state.mobilenumber}</Text>
                        </View> 
                        {this.state.error != '' && (
                        <View>
                            <Text style={[styles.msg, styles.errormsg ]}>{this.state.error}</Text>
                        </View>
                       )}
                        <View style={styles.iconwrap}>
                            <CodeInput
                                ref="OTPcode"
                                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                                codeLength={6}
                                activeColor='#166D92'
                                inactiveColor='#FFF'
                                autoFocus={true}
                                ignoreCase={true}
                                inputPosition='center'
                                size={40}
                                onFulfill={(isValid) => this.checkingOTP(isValid)}
                                containerStyle={{ marginTop: 30 }}
                                codeInputStyle={{ borderWidth: 1.5,  borderRadius: 10, fontWeight: 'bold' }}
                            />
                        </View>  
                        <View style={styles.resendmsg}>
                            <Text onPress={()=> this.resendOTP()} style={[styles.white]}>Resend OTP?</Text>
                        </View>
                        <View style={styles.pagination}>
                            <Icon name="circle" style={styles.hide} />       
                            <Icon name="circle" style={styles.iconstyle}  />
                        </View>
                    </Content>
                </View>
                </KeyboardAvoidingView>
                </ImageBackground>
                </DismissKeyboard>
                </GestureRecognizer>
        );    
    }
}