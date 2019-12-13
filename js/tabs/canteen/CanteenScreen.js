import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  View
} from 'react-native';

import { connect } from 'react-redux';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

import { RoleContext } from '../../CampusApp';
import HeaderIcon from '../../util/HeaderIcon';
import ReloadView from '../../util/ReloadView';
import TabbedSwipeView from '../../util/TabbedSwipeView';

import CanteenDayListView from './CanteenDayListView';
import { fetchDayPlans } from './redux';

const textCanteenInfo =
  'Mo-Fr geöffnet 8.30-13.45 Uhr \n' +
  'Mittagessen: 11.45-13.30 Uhr\n\n' +
  'Die Preise werden für die von Dir gewählte Personengruppe ' +
  'angezeigt (siehe Services > Einstellungen).\n\n' +
  'Tippe auf ein Gericht, um Informationen über Inhaltsstoffe anzeigen zu lassen.';

const textNfcInfo =
  '\n\nUm das Guthaben Deines DHBW-Ausweises auszulesen, ' +
  'muss NFC aktiviert sein (sofern vom Handy unterstützt).\n' +
  'Schau dazu in den Einstellungen unter "Drahtlos & Netzwerke" nach.\n' +
  'Danach brauchst Du einfach nur den Ausweis an die Rückseite Deines Handys ' +
  'zu halten.';

function selectPropsFromStore(store) {
  return {
    dayPlans: store.canteen.dayPlans,
    isFetching: store.canteen.isFetching,
    networkError: store.canteen.networkError
  };
}

class CanteenScreen extends Component {
  static navigationOptions = {
    headerRight: (
      <HeaderIcon
        onPress={() => {
          let textBody = textCanteenInfo;
          if (Platform.OS === 'android') textBody += textNfcInfo;
          return Alert.alert('Mensa Hangstraße 46-50', textBody);
        }}
        icon="help-outline"
      />
    )
  };

  async componentDidMount() {
    this.props.dispatch(fetchDayPlans());
  }

  _getPages = () => {
    return this.props.dayPlans.slice(0, 5).map((dayPlan, _) => {
      const dateParts = dayPlan.date.split('.').reverse();
      const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      return {
        title: format(date, 'EE dd.MM.', { locale: de }),
        content: (
          <RoleContext.Consumer>
            {({ role }) => (
              <CanteenDayListView meals={dayPlan.menus} role={role} />
            )}
          </RoleContext.Consumer>
        )
      };
    });
  };

  _renderScreenContent() {
    const { dayPlans, isFetching, networkError } = this.props;

    if (isFetching) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true} />
        </View>
      );
    }

    const buttonText = 'Speiseplan laden';
    if (dayPlans.length === 0) {
      if (networkError) {
        return (
          <ReloadView
            buttonText={buttonText}
            onPress={() => this.props.dispatch(fetchDayPlans())}
          />
        );
      } else {
        const infoText =
          'Zur Zeit gibt es für die Mensa keinen Speiseplan.';
        return (
          <ReloadView
            buttonText={buttonText}
            message={infoText}
            onPress={() => this.props.dispatch(fetchDayPlans())}
          />
        );
      }
    }

    return (
      <TabbedSwipeView count={dayPlans.length} pages={this._getPages()} />
    );
  }

  render() {
    return (
      <View style={styles.container}>{this._renderScreenContent()}</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  center: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default connect(selectPropsFromStore)(CanteenScreen);
