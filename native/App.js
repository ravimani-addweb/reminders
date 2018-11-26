/**
 * TickTodo App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import AppRoutes from './src/MainRoutes'
import { StyleProvider } from "native-base";
import getTheme from "./src/theme/components";
import variables from "./src/theme/variables/TickTodo";
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class App extends Component {

  render() {
    return (
      <StyleProvider style={getTheme(variables)}>
        <AppRoutes />
      </StyleProvider>
    );
  }
}
