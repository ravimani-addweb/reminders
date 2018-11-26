
import { NavigationActions, StackActions } from 'react-navigation';

export default class Navigation {

  constructor() {

  }

  setRoot = (route, param, props) => {
    let resetAction = StackActions.reset({
      index: 0,
      params: param,
      actions: [
        NavigationActions.navigate({ routeName: route})
      ]
    });
    props.navigation.dispatch(resetAction);
  }


}
