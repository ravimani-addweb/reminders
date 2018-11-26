
import React, { Component } from 'react';

import {
    View, Text, RefreshControl, Dimensions, Platform, Animated, Easing, AsyncStorage, SectionList, ScrollView, Alert
} from 'react-native';
import { Container,Icon, Content, Fab, ListItem } from 'native-base';
import styles from "./styles";
import ContentLoader from 'react-native-content-loader';
import { Rect } from 'react-native-svg';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import Checkbox from 'react-native-custom-checkbox';
import moment from "moment";

import * as MT from 'react-native-material-ui';
import firebase from 'react-native-firebase';

import Util from '../../common/services/util';
import FireAuth from '../../common/services/fireAuth';


const UP = 1;
const DOWN = -1;

const FIREBASE_DATABASE = firebase.database().ref('/reminder');


class Home extends Component {
    isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            checked1: false,
            isLoading: true,
            selected: [],
            searchText: '',
            active: 'home',
            moveAnimated: new Animated.Value(0),
            allReminder: [],
            todayDate:  moment(new Date()).startOf("day"),
            tomorrowDate: moment(new Date()).add(1,'days').startOf("day"),
            isNoData:false
        };

        this.util = new Util();
        this.fireAuth = new FireAuth();
    }

    componentDidMount() {
        this.isMounted = true;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                AsyncStorage.setItem('user', JSON.stringify(user));
                this.fetchData(user.uid);  
            } else {
            }
        }); 
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, isLoading: true });
        setTimeout(function () {
            this.setState({ refreshing: false, isLoading: false });
        }.bind(this), 5000);
    }
    
     fetchData(uid) {
      
        FIREBASE_DATABASE.child(uid).on('value', (snapshot) => {
            console.log('allReminder', this.state.allReminder);
            console.log('snapshot.val()', snapshot.val());

            if (snapshot.val() != null) {
                let result = snapshot.val();
                
                let temp = [];
                let today =[];
                let tomorrow = [];
                let upcoming = [];
                let allReminder = [];

                for( var key in result){
                    result[key].key = key;
                    if(result[key]['lable'] !='Completed' && !moment(result[key].date).isBefore(new Date)){
                        temp.push(result[key]);
                    }
                    
                }

                temp = this.util.sortByDate(temp,'date');

                console.log('temp >>>>', temp);

                for(var i in temp){
                    console.log(temp[i])
                    if(moment(temp[i].date).isSame(this.state.todayDate, 'day') && moment(temp[i].date).isAfter(this.state.todayDate)){
                        today.push(temp[i]);
                        console.log("Hello")
                        allReminder.push({
                            title:'Today',
                            data: today
                        });
                    }else if (moment(temp[i].date).isSame(this.state.tomorrowDate, 'day') && moment(temp[i].date).isAfter(this.state.tomorrowDate)){
                        tomorrow.push(temp[i]);
                        allReminder.push({
                            title:'Tomorrow',
                            data: tomorrow
                        });
                    }
                    else if (moment(temp[i].date).isAfter(this.state.tomorrowDate, 'day')){
                        upcoming.push(temp[i]);
                        console.log("upcoming",upcoming);
                        allReminder.push({
                            title:'Upcoming',
                            data: upcoming
                        });
                    }
                }
                console.log('allReminder AAA', allReminder);

                filtered = this.util.removeDuplicates(allReminder, 'title');
                console.log('allReminder filtered', filtered);
                filtered.length > 0 ? this.setState({isNoData : false}) : this.setState({isNoData : true,isLoading: false,});
                this.setState({allReminder: this.util.sortByAlphabet(filtered, 'title'), isLoading: false});
                console.log('allReminder', this.state.allReminder);
            } else {
                this.setState({allReminder:[], isNoData : true, isLoading: false,});
            }
        })
    }
   
    onAvatarPressed = (value) => {
        const { selected } = this.state;

        const index = selected.indexOf(value);

        if (index >= 0) {
            // remove item
            selected.splice(index, 1);
        } else {
            // add item
            selected.push(value);
        }

        this.setState({ selected });
    }
    onScroll = (ev) => {
        const currentOffset = ev.nativeEvent.contentOffset.y;

        const sub = this.offset - currentOffset;

        // don't care about very small moves
        if (sub > -2 && sub < 2) {
            return;
        }

        this.offset = ev.nativeEvent.contentOffset.y;

        const currentDirection = sub > 0 ? UP : DOWN;

        if (this.scrollDirection !== currentDirection) {
            this.scrollDirection = currentDirection;

            this.setState({
                bottomHidden: currentDirection === DOWN,
            });
        }
    }
    show = () => {
        Animated.timing(this.state.moveAnimated, {
            toValue: 0,
            duration: 225,
            easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            useNativeDriver: Platform.OS === 'android',
        }).start();
    }
    hide = () => {
        Animated.timing(this.state.moveAnimated, {
            toValue: 56, // because the bottom navigation bar has height set to 56
            duration: 195,
            easing: Easing.bezier(0.4, 0.0, 0.6, 1),
            useNativeDriver: Platform.OS === 'android',
        }).start();
    }

    handleRightIconClick = (props)=>{
        console.log("props",props)
        if(props.action == 'done'){

            Alert.alert(
                'Complete',
                'Are you sure want to mark reminder as Completed ?',
                [
                  {text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'YES', onPress: () => {
                      this.fireAuth.markAsCompleted(this.state.selected).then((res)=>{
                          res ? this.setState({selected:[]}) :''
                      }).catch((err)=>{
                          console.log("Error",err);
                      })
                  } 
                  },
                ],
                { cancelable: false }
              )     


        }else if(props.action== 'delete'){
                Alert.alert(
                  'Delete',
                  'Are you sure want to delete reminder ?',
                  [
                    {text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'YES', onPress: () => {
                        this.fireAuth.removeByKey(this.state.selected).then((res)=>{
                            res ? this.setState({selected:[]}) :''
                        }).catch((err)=>{
                            console.log("Error",err);
                        })
                    }
                    
                    },
                  ],
                  { cancelable: false }
                )           
        }

    }
    renderToolbar = () => {
        if (this.state.selected.length > 0) {
            return (
                <MT.Toolbar
                    key="toolbar"
                    leftElement="clear"
                    onLeftElementPress={() => { this.setState({ selected: [] }) }}
                    centerElement={this.state.selected.length.toString()}
                    rightElement={['done', 'delete']}
                    onRightElementPress={(props) => {this.handleRightIconClick(props)}}
                    style={{
                        container: { backgroundColor: 'white' },
                        titleText: { color: 'rgba(0,0,0,.87)' },
                        leftElement: { color: 'rgba(0,0,0,.54)' },
                        rightElement: { color: 'rgba(0,0,0,.54)' },
                    }}
                />
            );
        }
        return (
            <MT.Toolbar
                key="toolbar"
                leftElement="menu"
                onLeftElementPress={() => this.props.navigation.openDrawer()}
                centerElement="Home"
                searchable={{
                    autoFocus: true,
                    placeholder: 'Search',
                    onChangeText: value => this.isMounted ? this.setState({ searchText: value }) : '',
                    onSearchClosed: () =>this.isMounted? this.setState({ searchText: '' }) :'',
                }}
            />
        );
    }

    _contentLoader = () => {
        if (this.state.isLoading) {
            return ['1','2','3'].map((item, key) => {
                return (
                    <ScrollView>
                        <View>
                        <ListItem key={key+Math.random() -10} itemDivider style={[styles.bgcolor]}>
                            <ContentLoader primaryColor="#e8f7ff"
                                secondaryColor="#4dadf7"
                                speed={4}
                                key={key+Math.random() -10}
                                height={35}
                                width={deviceWidth}>
                                    <Rect x="0" y="7" rx="3" ry="3" width={deviceWidth/2 -50} height="15" />
                            </ContentLoader>
                        </ListItem>
                        
                        <MT.ListItem
                            key={key+Math.random() -10}
                            divider
                            numberOfLines={3}
                            centerElement={
                            <ContentLoader primaryColor="#e8f7ff"
                            secondaryColor="#4dadf7"
                            speed={4}
                            height={35}
                            width={deviceWidth}>
                                <Rect x="0" y="5" rx="3" ry="3" width={deviceWidth-30} height="7.76" /> 
                                <Rect x="0" y="25" rx="3" ry="3" width={deviceWidth / 2} height="7.76" />
                            </ContentLoader>}
                        />

                        <MT.ListItem
                            key={key+Math.random() -10}
                            divider
                            numberOfLines={3}
                            centerElement={
                            <ContentLoader primaryColor="#e8f7ff"
                            secondaryColor="#4dadf7"
                            speed={4}
                            height={35}
                            width={deviceWidth}>
                                <Rect x="0" y="5" rx="3" ry="3" width={deviceWidth-30} height="7.76" /> 
                                <Rect x="0" y="25" rx="3" ry="3" width={deviceWidth / 2} height="7.76" />
                            </ContentLoader>}
                        />
                        </View>
                    </ScrollView>
                   
                );
            });
        }
    }

    _renderItem = ({item, i , section}) => (
        <View>
             <MT.ListItem
                    divider
                    numberOfLines={2}
                    rightElement={ <Text style={styles.timestyle}>{moment(item.date).format('LT')}</Text> }
                    centerElement= {
                    <View style={[styles.truncate, styles.liststyle]}>
                        <Checkbox
                        name={item.key}
                        size={30}
                        checked={this.state.selected.includes(item.key) ? true : false}
                        style={styles.checkboxstyle}
                        onChange={(name, checked) => { this.onAvatarPressed(name) } }/>
                        <Text onPress={()=> this.props.navigation.push("Details",{data:item, slug:'home'})} numberOfLines={2} style={styles.eventstyle}>{item.title}</Text>
                    </View>
                }      
            />
        </View>
    )

    _renderSectionHeader = ({section: {title}}) => {
        return (
            <View >
                <ListItem itemDivider style={[styles.bgcolor]}>
                    <Text style={styles.dividerstyle}>
                    {title == 'Today' ? `${title} (${moment(this.state.todayDate).format('DD/MM/YYYY') })` : ( title == 'Tomorrow' ?  `${title} (${moment(this.state.tomorrowDate).format('DD/MM/YYYY')})` : title )}
                    </Text>
                </ListItem>
            </View>
        )
    }

    render() {
        return (
            <Container>
                {this.renderToolbar()}

                <Content
                    onScroll={this.onScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >  

                {this.state.isNoData && (
                <View>
                    <Text> Welcome to TickTodo</Text>
                    <Text> If you wanna to add reminder, Just tap the <Icon name="md-add-circle" /> at any time. Which we put conveniently on the bottom right of the page.</Text>
                </View>
                )}

                {this._contentLoader()}
                {!this.state.isLoading && (
                    <View>
                        <SectionList
                            sections={this.state.allReminder}
                            renderItem={this._renderItem}
                            renderSectionHeader={this._renderSectionHeader}
                            keyExtractor={(item, index) => item + index}
                        />

                    </View>  
                )}
                </Content>

                <Fab onPress={()=> this.props.navigation.push("AddTask")} direction="right" style={{ backgroundColor: '#4FC3F7', marginBottom:50 }} position="bottomRight">
                    <Icon name="add" />
                </Fab>


                <MT.BottomNavigation
                    active={this.state.active}
                    hidden={this.state.bottomHidden}
                    style={{ container: { position: 'absolute', bottom: 0, left: 0, right: 0 } }}
                >
                    <MT.BottomNavigation.Action
                        key="home"
                        icon={<Icon name="home" />}
                        label="Home"
                        onPress={() => this.isMounted ? this.setState({ active: 'home' }): ''}
                    />
                </MT.BottomNavigation>

            </Container>
        );
    }
}
export default Home;
