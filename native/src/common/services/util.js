import moment from "moment";
import _ from "lodash";
import { AsyncStorage } from 'react-native';
 
export default class Util {

  constructor() {

  }

  sortByDate = (array, field) => {
   return _.sortBy(array, field);
  }

  sortByAlphabet = (array, field) => {
     return array.sort((a, b) => a[field].localeCompare(b[field]))
  }

  removeDuplicates = (array, field) => {
    return _.uniqBy(array, function (e) {
      return e[field];
    });
  }

  getUserData = () =>{
    return AsyncStorage.getItem('user');
  }

 

}
