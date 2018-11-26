const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {
  container: {
    position: 'relative',
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },
  // textWrapper: {
  //   height: hp('100%'),
  //   width: wp('84.5%')
  // },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  loginForm:{
    justifyContent:'center',
    //alignItems:'center',
    paddingLeft:10,
    paddingRight:10,
    paddingBottom:10,
    paddingTop: 10,
    marginTop: 10
  },
  btnLogin:{
    width: 200,
    paddingVertical: 5,
    marginTop:30,
    marginLeft: 10,
    backgroundColor: '#4FC3F7',
    color: '#6b7278',
    borderRadius: 5,
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  btnstyle: {
    fontSize: 15,
    textAlign: 'center'
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  inputbg: {
    paddingLeft: 10,
    paddingBottom:10,
    marginVertical: 20,
    borderRadius: 5,
    fontSize: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  textinput: {
    color: '#FFF',
    textAlign:'center',
    height: 40,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  hide: {
    color: "#ddd"
  },
  bgicon: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center',
    opacity: 0.1
  },
  logo:{
    height:300,
    width:500,
  },
  upperlogo: {
    height:200,
    width: 200,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  labelalign: {
    marginLeft: 10,
  },
  pagination: {
    paddingHorizontal: 20,
    marginTop: 30,
    flex: 1,
    justifyContent:'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconstyle: {
    margin: 10,
    color: "#FFF"
  },
  otpmsg: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column'
  },
  msgstyle: {
      marginVertical: 10,
      color: '#FFF',
      fontSize: 15,
      textAlign: 'center'
  },
  iconwrap: {
      marginVertical: 13,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
  },
  dashiconstyle: {
    fontSize: 20,
    marginHorizontal: 5
  },
  white: {
    color: "#FFF"
  },
  resendmsg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msg: {
    width: deviceWidth - 20,
    marginTop: 20,
    textAlign: 'center'
  },
  errormsg: { 
    color:'red',
  },
  successmsg: {
    color: "green"
  }
};