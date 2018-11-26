import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import styles from "./style";
import firebase from 'react-native-firebase';
import { AsyncStorage } from "react-native"
import Navigation from '../../common/services/navigation';
import { images } from '../../assets/images/images';

const drawerCover = images.bgLogo.uri;

const datas = [
  {
    name: "Home",
    route: "Home",
    icon: "home",
    bg: "#2196F3"
  },
  {
    name: "Calender",
    route: "Calender",
    icon: "md-calendar",
  },
  {
    name: "Logout",
    route: "logout",
    icon: "key",
  },
  
];



class SideBar extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
    this.navigation = new Navigation();
  }

  moveScreen = (data) => {
    if(data.route != 'logout') {
      this.props.navigation.navigate(data.route)
    }else{
      firebase.auth().signOut();
      AsyncStorage.clear();
      this.navigation.setRoot('Login',{}, this.props);
    }
    
  }
  

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <Image source={drawerCover} style={styles.drawerCover} />
          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.moveScreen(data) }
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: data.bg ? data.bg :"#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={[styles.text, {color:data.bg}]}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

export default SideBar;
