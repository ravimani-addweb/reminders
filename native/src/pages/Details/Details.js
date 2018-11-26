import React, { Component } from 'react';
import { Text, View, Alert, AsyncStorage, Keyboard } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';
import styles from "./styles";

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as MT from 'react-native-material-ui';

import DismissKeyboard from '../../common/components/dissmissKeyboard';

import moment from "moment";

export default class Details extends Component {
    constructor(props) {
        super(props)
            this.state = {
                isDisable: true,
                data: this.props.navigation.getParam('data'),
                slug:this.props.navigation.getParam('slug')
            }
    }
    render() {
        const { data } = this.state;
        return (
            <DismissKeyboard>
                <View style={styles.container}>
                    <MT.Toolbar
                    key="toolbar"
                    leftElement="arrow-back"
                    onLeftElementPress={() => this.props.navigation.goBack()}
                    centerElement={moment(data.date).format("DD/MM/YYYY")}
                    />
                    <Content style={styles.content}>
                        {/* <View style={styles.mb10}>
                            <Text style={[styles.lineheight,styles.fontsize]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend vehicula arcu. Integer elit sem, luctus quis sollicitudin quis, varius vitae ante. </Text>
                        </View> */}
                        <View style={[styles.eventtimewrap, styles.marginwrap]}>
                            <View style={styles.eventtitle}>
                                 <Text style={[styles.dot,styles.mr10]}></Text>
                                 <Text style={styles.eventtitle}>{data.title}</Text>
                            </View>
                            <View style={styles.eventcontainer}>
                                <View style={[styles.eventwrap]}>
                                    <SimpleLineIcons name="event" size={15} style={[styles.mr10,styles.primary]} /> 
                                    <Text style={[styles.primary, styles.mb10]}>{moment(data.date).format("dddd DD MMM")}</Text>
                                </View>
                                <View style={[styles.eventwrap,styles.flexstart]}>
                                    <SimpleLineIcons name="clock" size={15} style={[styles.mr10,styles.primary]} /> 
                                    <Text style={styles.primary}>{moment(data.date).format("LT")}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.btnmargin,styles.marginwrap]}>
                                <Button onPress={()=>this.onSubmit()} style={{backgroundColor: '#4FC3F7'}} info block>
                                    <SimpleLineIcons name="check" size={18}  style={[styles.white,styles.mr10]}/>
                                    <Text style={[styles.btn,styles.white]}> Done </Text>
                                </Button>
                        </View>
                    </Content>
                </View>
            </DismissKeyboard>
        )
    }
}