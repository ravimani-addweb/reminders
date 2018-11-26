import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
import EventEmitter from "react-native-eventemitter";
import Util from './util';

const FIREBASE_DATABASE = firebase.database().ref('/reminder');

export default class FireAuth {

  constructor() {
    this.util = new Util();


  }

  
    confirmPhone = async (phoneNumber) => {
        const phoneWithAreaCode = phoneNumber;
        return new Promise((res, rej) => {
            firebase.auth().verifyPhoneNumber(phoneWithAreaCode)
                .on('state_changed', async (phoneAuthSnapshot) => {
                    console.log('phone-->',phoneAuthSnapshot)
                    EventEmitter.emit("auth_changed", phoneAuthSnapshot);
                    switch (phoneAuthSnapshot.state) {
                    case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
                        await this.confirmCode(phoneAuthSnapshot.verificationId, phoneAuthSnapshot.code)
                        res(phoneAuthSnapshot)
                        break

                    case firebase.auth.PhoneAuthState.CODE_SENT:
                        AsyncStorage.setItem("AuthId",phoneAuthSnapshot.verificationId)
                        res(phoneAuthSnapshot)
                        break

                    case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: 
                        AsyncStorage.setItem("AuthId",phoneAuthSnapshot.verificationId)
                        res(phoneAuthSnapshot)

                    case firebase.auth.PhoneAuthState.ERROR:
                        rej(phoneAuthSnapshot)
                        break

                    }
                })
        })
    }

    confirmCode = async (verificationId, code) => {
        try{
            const credential = await firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            console.log('credential-->',credential)
            AsyncStorage.setItem("code",code)
            AsyncStorage.setItem("credential",credential)
            await this.authenticate(credential)
            return credential
        } catch(e){
            throw new Error(e)
        }
    }

    authenticate = async (credential) => {
        await firebase.auth().signInWithCredential(credential)
    }

    removeByKey = (keys) => {
        return new Promise((resolve, reject) => { 
            let uid;
            this.util.getUserData().then((res) => {
                res= JSON.parse(res);
                uid = res.uid
                keys.forEach(key => {
                    FIREBASE_DATABASE.child(uid).child(key).remove().then((res)=>{
                        resolve(keys);
                    }).catch((err)=>{
                        reject(false); 
                    })
                });
            }).catch((err)=>{
                reject(false);
                console.log("My err >>>>",err)
            })

        })
    }

    markAsCompleted = (keys) => {
        return new Promise((resolve, reject) => { 
            let uid;
            this.util.getUserData().then((res) => {
                res= JSON.parse(res);
                uid = res.uid
                keys.forEach(key => {
                    FIREBASE_DATABASE.child(uid).child(key).update({
                        lable : 'Completed'
                    }).then((res)=>{
                        resolve(keys);
                    }).catch((err)=>{
                        reject(false); 
                    })
                });
            }).catch((err)=>{
                reject(false);
                console.log("My err >>>>",err)
            })

        })
    }

}
