// @flow
'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Provider } from 'react-redux';

import setupStore from './campusRedux';

import TabsView from './TabsView';

export default class CampusApp extends Component {
  constructor() {
    super();
    this.state = {
      loading: true, // while loading offline data with redux
      store: setupStore(() => this.setState({loading: false})),
    };
  }

  render() {
    const content = this.state.loading ?
      <View style={styles.center}>
        <ActivityIndicator animating={true}/>
      </View>
      : <TabsView/>;
    return (
      <Provider store={this.state.store}>
        <View style={styles.container}>
          <StatusBar
            translucent={true}
            backgroundColor="rgba(0, 0, 0, 0.2)"
            barStyle="light-content"
           />
          {content}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
