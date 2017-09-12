import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableHighlight } from 'react-native';
import { bigFont, smallFont, listViewRowPaddingHorizontal } from '../../util/Constants';
import { mapsLocations } from '../../../env.js';
import { openDirections } from './helpers';
import Colors from '../../util/Colors';

export default class RoomDetails extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <View style={styles.container}>
                <Image style={styles.headImage} resizeMode='stretch' source={require('./img/rooms/overview.png')} />
                <View style={styles.sectionContainer}>
                    <View style={styles.section}>
                        <Image style={styles.icons} resizeMode='contain' source={require('./img/rooms-icon-head.png')} />
                        <View style={styles.textSection}>
                            <Text style={styles.heading}>{this.props.room["Begriff 1"]}</Text>
                            <Text style={styles.subHeading}>{this.props.room["Begriff 2"]}</Text>
                        </View>
                    </View>

                    <TouchableHighlight underlayColor='#CCC' onPress={() => this._openMaps(this.props.room)}>
                    <View style={styles.section}>
                        <Image style={styles.icons} resizeMode='contain' source={require('./img/rooms-icon-location.png')}/>
                        
                        <View style={styles.textSection}>
                            <Text style={styles.heading}>{this.props.room["Raum"]}</Text>
                        </View>
                    </View>
                    </TouchableHighlight>
                    

                    <View style={styles.section}>
                        <Image style={styles.icons} resizeMode='contain' source={require('./img/rooms-icon-tags.png')}/>
                        <View style={styles.textSection}>
                            <Text style={styles.heading}>Tags:</Text><Text style={styles.subHeading}>{this._getTags(this.props.room).join(', ')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _openMaps(room) {
        const building = room['Gebäude'];
        try {
            const lat = mapsLocations[building].lat;
            const long = mapsLocations[building].long;
            openDirections(lat, long);
        } catch(e) {
            console.log(e);
        }
    }
    _getTags(room) {
        const tags = new Array(room['Gebäude'], room['Begriff 1'], room['Begriff 2'], room['Begriff 3'], room['Begriff 4']);
        return tags.filter(tag => {
            return (tag != '');
        });
    }

}
const win = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionContainer: {
        paddingVertical: 1,
        flex: 2,
        justifyContent: 'space-between',
        borderTopWidth: 2,
        borderTopColor: '#CCC',

    },
    headImage: {
        flex: 3,
        width: win.width,
    },
    heading: {
        fontSize: bigFont
    },
    subHeading: {
        fontSize: smallFont
    },
    icons: {
        width: 40,
        height: 40,
        flex: 1,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: listViewRowPaddingHorizontal,
        paddingVertical: 15,
    },
    textSection: {
        flex: 4
    }
});