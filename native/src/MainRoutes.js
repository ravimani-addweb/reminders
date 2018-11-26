import React, {Component} from 'react';
import { Root } from "native-base";
import { Dimensions, Animated, Easing, AsyncStorage } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Otp from "./pages/Otp/Otp";
import SideBar from './pages/Sidebar/index';
import AddTask from './pages/AddTask/AddTask';
import Setup from './boot/Setup';
import Details from './pages/Details/Details';
import Calender from './pages/Calender/Calender';


const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    AddTask:{ screen:AddTask },
    Calender:{ screen:Calender },
    Details:{ screen:Details },
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63"
  },
    drawerWidth: Dimensions.get('window').width - 120,
    contentComponent: props => <SideBar {...props} />
  }
);



const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {      
      const { layout, position, scene } = sceneProps
      const thisSceneIndex = scene.index
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      })
      return { transform: [ { translateX } ] }
    },
  }
}

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
    Home: { screen: Home },
    Setup:{ screen: Setup},
    Login: { screen: Login },
    Otp: { screen: Otp },
    AddTask:{ screen:AddTask },
    Details:{ screen:Details },
    Calender:{ screen:Calender }
  },
  {
    initialRouteName: 'Setup',
    transitionConfig,
    headerMode: "none",
  }
);


export default class AppRoutes extends Component {
  render() {
    return (
        <Root>
         <AppNavigator />
        </Root>
    );
  }
}


