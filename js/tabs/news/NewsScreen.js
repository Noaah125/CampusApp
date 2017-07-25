// @flow
'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import NewsCell from './NewsCell';
import NewsDetails from './NewsDetails';
import { fetchNews } from './redux';
import NewsSettings from './NewsSettings';
import NewsItem from '../../util/types.js';
import CampusHeader from '../../util/CampusHeader';
import ReloadView from '../../util/ReloadView';
import TabbedSwipeView from '../../util/TabbedSwipeView';
import { feeds } from '../../util/Constants';

function selectPropsFromStore(store) {
  return {
    news: store.news.news,
    isFetching: store.news.isFetching,
    networkError: store.news.networkError,
  };
}

class NewsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {selectedNewsItem: null,};

    this._onBackPress = this._onBackPress.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchNews());
  }

  _onNewsItemPressed(newsItem) {
    if(Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this._onBackPress);
    }
    this.setState({ selectedNewsItem: newsItem });
  }

  _onBackPress() {
    if(this.state.selectedNewsItem !== null){
      if(Platform.OS === 'android'){
        BackHandler.removeEventListener('hardwareBackPress', this._onBackPress);
      }
      this.setState({selectedNewsItem: null})
      return true; // Back button handled
    }
    return false;
  }

  _getPages(news) {
      let pages = feeds.map(
              (feed) => {
                  return {
                      title: feed.name,
                      content: <ScrollView bounces={false}>{this._renderNewsItems(news[feed.key])}</ScrollView>,
                  };
              }
          );
      pages.push({
        title: 'Einstellungen',
        content: <ScrollView bounces={false}><NewsSettings></NewsSettings></ScrollView>
      })
      return pages;
  }

  _renderNewsItems(news) {
    if(news) {
      return (
        news.map(
          (newsItem, index) =>
            <NewsCell key={'t' + index} news={newsItem}
              onPress={() => this._onNewsItemPressed(newsItem)}/>
        )
      );
    } else {
      return (<View></View>);
    }
    
  }

  _renderScreenContent() {
    const { news, isFetching, networkError } = this.props;

    if(isFetching) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true}/>
        </View>
      );
    }

    const buttonText = 'News laden';
    if(networkError && !news.length) {
      return (
        <ReloadView buttonText={buttonText}
          onPress={() => this.props.dispatch(fetchNews())}/>
      );
    }

    return (
        <TabbedSwipeView pages={this._getPages(news)}/>
    );
  }

  render() {
    if(this.state.selectedNewsItem !== null) {
      return (
        <NewsDetails
          backAction={this._onBackPress.bind(this)}
          news={this.state.selectedNewsItem}/>
      );
    };

    return (
      <View style={styles.container}>
        <CampusHeader title="News" style={styles.header}/>
        {this._renderScreenContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    center: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        elevation: 0
    },
});

export default connect(selectPropsFromStore)(NewsScreen);
