// @flow
'use strict';

import React, {Component} from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';

import {connect} from 'react-redux';

import WelcomeScreen from './WelcomeScreen';
import TabsView from './TabsView';
import PushController from "./PushController";

function selectPropsFromStore(store) {
    return {
        selectedRole: store.settings.selectedRole,
    };
}

class CampusApp extends Component {
    render() {
        let content = <TabsView/>;
        if (this.props.loading) {
            content =
                <View style={styles.center}>
                    <ActivityIndicator animating={true}/>
                </View>
        } else if (!this.props.selectedRole) {
            content = <WelcomeScreen/>;
        }

        return (
            <View style={styles.container}>
                <PushController/>
                <StatusBar
                    translucent={true}
                    backgroundColor="rgba(0, 0, 0, 0.2)"
                    barStyle="light-content"
                />
                {content}
            </View>
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

export default connect(selectPropsFromStore)(CampusApp);
