import React, { Component } from 'react';
import { Text, View, Alert, AsyncStorage, Keyboard,StyleSheet } from 'react-native';
import { Container, Content, Button, Icon, Badge } from 'native-base';
import { Calendar, CalendarList, Agenda,CalendarTheme } from 'react-native-calendars';
import moment from "moment";
import * as MT from 'react-native-material-ui';
import firebase from 'react-native-firebase';
import Util from '../../common/services/util';

const FIREBASE_DATABASE = firebase.database().ref('/reminder');

export default class Calender extends Component {
    constructor(props) {
        super(props);
        this.state = {
          items: {},
          todayDate:  moment(new Date()).startOf("day"),
          tomorrowDate: moment(new Date()).add(1,'days').startOf("day"),
        };
        this.util = new Util();
      }


      componentDidMount(){
        AsyncStorage.getItem('user').then((result, err)=>{
          if(result){
            console.log("AAAAAAAAAa")
            this.fetchData(JSON.parse(result).uid);
          }
        })
        
      }

      fetchData(uid) {
      
        FIREBASE_DATABASE.child(uid).on('value', (snapshot) => {
    
            console.log('snapshot.val()', snapshot.val());

            if (snapshot.val() != null) {
                let result = snapshot.val();
                let reminders = {};
                let temp = [];
                let data =[]
                for( var key in result){
                  data.push(result[key]);                 
                }

                data = this.util.sortByDate(data,'date');

                console.log("My Data", data)
                data.forEach((data, i) => {
                    console.log('Date >>',data);
                    if(moment(data.date).isBefore(new Date)){
                      data['lable'] = 'Completed';
                    }
                  
                    if(reminders.hasOwnProperty(new Date(data.date).toISOString().split('T')[0])){
                      reminders[new Date(data.date).toISOString().split('T')[0]].push(data)
                    }else {
                      temp.push(data)
                      reminders[new Date(data.date).toISOString().split('T')[0]] = temp
                      temp =[];
                    }
                });
                
                console.log("reminders >>>", reminders);
                this.setState({items:reminders});

            } else {
                this.setState({items:{}, isNoData : true, isLoading: false,});
            }
        })
    }
    render () {
        return (

          // <View style={styles.container}>
          //           <MT.Toolbar
          //           key="toolbar"
          //           leftElement="menu"
          //           onLeftElementPress={() => this.props.navigation.openDrawer()}
          //           centerElement="Calender"
          //           />
          //           <Content style={styles.content}>
                       
                    <Agenda
                        items={this.state.items}
                        //loadItemsForMonth={this.loadItems.bind(this)}
                        selected= {new Date()}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        rowHasChanged={this.rowHasChanged.bind(this)}
          
                      />

                //     </Content>
                // </View>


           
        )
    }

  renderItem(item) {
    return (
      <View style={styles.item}>
        <View style={[styles.event,{height: 100}]}>
          <Text style={styles.bluebasecolor}>{moment(item.date).format("LT")}</Text>
          <Text style={styles.bluebasecolor}>{item.title}</Text>
          {item.hasOwnProperty('lable') && (
            <Badge success>
              <Text style={{ color: 'white' }}>{item.lable}</Text>
            </Badge>
          )}
          
         
        </View>
        <View style={styles.time}>
            <Text style={[styles.grayprimecolor,styles.font]}>{moment(item.date).format("DD/MM/YYYY")}</Text>
            <Icon onPress={()=> this.props.navigation.push("Details",{data:item,slug:'calender'})} name="md-arrow-dropright-circle" />
        </View>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={[styles.item,styles.rembgcolor]}>
        <View style={styles.emptyDate}><Text style={styles.bluebasecolor}>No Reminders Set</Text></View>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  

}

  
const styles = StyleSheet.create({
  item: {
    height: 150,
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10,
    marginTop: 17,
    marginRight: 10,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  content: {
      padding: 20,
  },
  rembgcolor: {
    backgroundColor: '#d9e1e8'
  },
  event: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  bluebasecolor: {
    color: "#546e7a"
  },
  time: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start'
  },
  grayprimecolor: {
    color: "#b6c1cd"
  },
  font: {
    fontSize: 12,
  },
  emptyDate: {
    flex:1,
    backgroundColor: '#d9e1e8',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    color: "#546e7a"
  }
});
