import React, { Component } from 'react';
import { Text, View, Alert, AsyncStorage, Keyboard } from 'react-native';
import { Container, Content, Button } from 'native-base';
import styles from "./styles";
import { TextField } from 'react-native-material-textfield';

import moment from 'moment';
import firebase from 'react-native-firebase';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as MT from 'react-native-material-ui';
import DateTimePicker from 'react-native-modal-datetime-picker';

import ToastMSG from '../../common/services/toast';
import Push from '../../common/services/pushnotification';
import DismissKeyboard from '../../common/components/dissmissKeyboard';
import Spinner from 'react-native-loading-spinner-overlay';


let firereminder = firebase.database().ref('/reminder');
// let time = new Date().toLocaleString();

export default class AddTask extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            error: false,
            Today: true,
            Tomorrow: false,
            Ondate: false,
            DateText: moment(new Date()).add(1, 'hours'),
            DateHolder: null,
            isCalender: false,
            dateMode:'datetime',
            isDisable: true,
            isValidTime:'',
            user:{},
            spinner: false
        }
        this.toast = new ToastMSG();
        this.push = new Push();
        AsyncStorage.getItem('user', (err, result) => {
            if(result){
                console.log(result);
               this.setState({user:JSON.parse(result)})
            }
        });
    }

    onSubmit = () => {
        if( !this.state.isDisable && moment(this.state.DateText).isBefore(new Date())){
            this.toast.addToast(`Incorrect Time ${moment(this.state.DateText).format('LT')}`,'danger');
        }else if(!this.state.isDisable){

            this.setState({ spinner: true});
            let setPushObj =  {
                    id: Math.floor((Math.random() * 100) + 1 + Math.random() * 1000),
                    autoCancel: false,
                    largeIcon: "ic_launcher", 
                    bigText:this.state.title, 
                    date: new Date(this.state.DateText),
                    /* iOS and Android properties */
                    title: "Reminder", // (optional)
                    message: this.state.title, // (required)
            }
            firereminder.child(this.state.user.uid).push({
                title: this.state.title,
                createdAt: new Date(),
                date: this.state.DateText
            }).then((res) => {
                console.log('===>', res);
                this.toast.addToast('Reminder has been set Successfully.','success');
                this.push.setPush(setPushObj);
                this.setState({ spinner: false});
                this.props.navigation.goBack();
            }).catch((err) => {
                console.log('===>', err);
                this.setState({ spinner: false});
                this.toast.addToast('Something went wrong. Please try again !!!','danger');
            });
        }
    }

    onToday = () => {
        Keyboard.dismiss();
        this.setState({ DateText : moment(new Date()).add(1, 'hours'), Today: true, Tomorrow: false, Ondate: false});
    }
    onTomorrow = () => {
        Keyboard.dismiss();
        this.setState({ DateText :  moment(new Date()).add(1,'days'), Today: false, Tomorrow: true, Ondate: false });
    }
    onDate = () => {
        Keyboard.dismiss();
        this.setState({ isCalender: true, dateMode:'datetime', Today: false, Tomorrow: false, Ondate: true })
    }
    selectTime = () => {
        Keyboard.dismiss();
        this.setState({ isCalender: true, dateMode:'time'})
    }
    selectDate = () => {
        Keyboard.dismiss();
        this.setState({ isCalender: true, dateMode:'date'})
    }

    hideDateTimePicker = () => this.setState({ isCalender: false });

    handleDatePicked = (date) => {
        this.state.Tomorrow ? date = moment(date).add(1,'days') : '';
        this.setState({ DateText : date});
        //alert(moment(date).isBefore(moment(new Date())))
        if(moment(date).isBefore(moment(new Date()))){
            this.toast.addToast(`Incorrect Time ${moment(this.state.DateText).format('LT')}`,'danger');
            this.setState({isDisable:true})
        }else{
            this.state.title.trim() == '' ? this.setState({isDisable:true}) : this.setState({isDisable:false}); 
           
        }

        if(moment(date).isSame(new Date(), 'day')){
            this.setState({ Today: true, Tomorrow: false, Ondate: false });
        }else if(moment(date).isSame(moment(new Date()).add(1,'days'), 'day')){
            this.setState({ Today: false, Tomorrow: true, Ondate: false });
        }else {
            this.setState({ Today: false, Tomorrow: false, Ondate: true });
        }
        this.hideDateTimePicker();
    };

    onTitleChange = ( title ) => {
        if(title.trim() == ''){
            this.setState({isDisable:true,error:true}) 
        }else{
            this.setState({isDisable:false, title:title.trim(), error:false})
        }
    }


    render() {
        return (
            <DismissKeyboard>
            <View style={styles.container}>
                <MT.Toolbar
                style={{backgroundColor: "#4FC3F7"}}
                key="toolbar"
                leftElement="arrow-back"
                onLeftElementPress={() => this.props.navigation.goBack()}
                centerElement="Add Task"
                />

                <Spinner 
                    visible={this.state.spinner}
                />
                    <Content style={styles.AddTaskwrap}>
                        <View>
                            <View style={{marginHorizontal: 10}}> 
                                <TextField 
                                 multiline={true}
                                 label='Remind me about...'
                                 labelFontSize={18}
                                 labelPadding={15}
                                 fontSize={18}
                                 inputContainerPadding={10}
                                 tintColor="#ABABAB"
                                 baseColor="#ABABAB"
                                 textColor="#5F5F5F"
                                 error={this.state.error}
                                 onChangeText={title => {this.onTitleChange(title)}}
                                />
                            </View>
                        <View style={[styles.iconwrap, styles.marginwrap,]} >
                            <View>
                                <SimpleLineIcons name="calendar" size={25}  style={[styles.basecolor, styles.mr10]}  />   
                            </View>
                            <View style={styles.dateTxt} >
                                <Text onPress={()=>this.onToday()} style={[styles.textwrap,this.state.Today ? styles.basecolor : styles.primary]}>Today</Text>
                                <Text onPress={()=>this.onTomorrow()}  style={[styles.textwrap,this.state. Tomorrow ? styles.basecolor : styles.primary]}>Tomorrow</Text>
                                <Text onPress={()=>this.onDate()} style={[styles.textwrap,this.state.Ondate ? styles.basecolor : styles.primary]}>On a date
                                </Text>
                            </View>                                
                        </View>
                        {/* <View style={[styles.datepickerwrap, styles.iconwrap]}> */}
                            <View style={[styles.marginwrap, styles.iconwrap]}>
                                <View>
                                    <SimpleLineIcons name="event" size={25} style={[styles.basecolor]} />          
                                </View>
                                <View style={[styles.textfieldwrap]}>
                                    <Button transparent style={[styles.datePickerBox, styles.dateTxt]}  onPress={()=>this.selectDate()}>
                                        <View>
                                            <Text style={[styles.datePickerText]}>{moment(this.state.DateText).format('DD-MM-YYYY')}</Text>
                                        </View>
                                    </Button>
                                </View>
                                <View>
                                    <SimpleLineIcons name="clock" size={25} style={[styles.basecolor]} />  
                                </View>
                                <View style={styles.textfieldwrap}>
                                    <Button transparent style={[styles.datePickerBox, styles.dateTxt]} onPress={()=>this.selectTime()} >
                                        <View>
                                            <Text style={styles.datePickerText}>{moment(this.state.DateText).format('LT')}</Text>
                                        </View>
                                    </Button>
                                </View>
                            </View>

                            {/* <View style={[styles.datewrap, styles.marginwrap]}>
                                <View>
                                    <SimpleLineIcons name="clock" size={25} style={[styles.basecolor]} />  
                                </View>
                                <View style={styles.textfieldwrap}>
                                    <Button transparent style={[styles.datePickerBox]} onPress={()=>this.selectTime()} >
                                        <View>
                                            <Text style={styles.datePickerText}>{moment(this.state.DateText).format('LT')}</Text>
                                        </View>
                                    </Button>
                                </View>
                            </View> */}
                        {/* </View> */}
                            
                            <View style={[styles.btnmargin]}>
                                <Button onPress={()=>this.onSubmit()} style={{opacity: this.state.isDisable ? .2 : 1, backgroundColor: '#4FC3F7'}} info block>
                                    <Text style={[styles.btn, this.state.isDisable ?  styles.primary : styles.white ]}> Submit </Text>
                                </Button>
                            </View>
                            <View style={[styles.cancelbtnwrap]}>
                                <Button onPress={()=>this.props.navigation.goBack()} style={styles.container} block>
                                    <SimpleLineIcons name="close" size={20} style={[styles.cancelicon]} />
                                    <Text style={styles.canceltext}>Cancel</Text> 
                                </Button>
                            </View>
                          
                            <DateTimePicker
                                isVisible={this.state.isCalender}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                mode={this.state.dateMode}
                                minimumDate={new Date()}
                            />
                        </View>
                    </Content>
            </View>
            </DismissKeyboard>
        )
    }
}