var PushNotification = require('react-native-push-notification');

export default class Push {

  constructor() {

  }

  setPush = (objs) => {
    PushNotification.localNotificationSchedule(objs);
    return true
  }

}
