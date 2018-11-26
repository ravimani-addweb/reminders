import { Toast } from 'native-base';

export default class ToastMSG {

  constructor() {

  }

  addToast = (text='',type='success',buttonText='',position='bottom',duration=3000) => {
        Toast.show({
            text:text,
            buttonText: buttonText,
            position:position,
            type:type,
            duration:duration
      })
  }

}
