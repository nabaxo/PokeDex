import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';

export const styleSheet: StyleSheet.NamedStyles<any> = {
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        paddingTop: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: '80%',
    },
    list: {
        flex: 1,
        width: '100%',
    },
    listEntry: {
        flexDirection: 'row',
        // height: 50,
    },
    listText: {
        fontSize: 16,
        width: '100%',
        height: 32,
        paddingLeft: 10,
        alignSelf: 'flex-end',
        flex: 10,
    },
    listSeparator: {
        marginVertical: 10,
        height: 1,
        width: '100%'
    },
    sprite: {
        height: 32,
        width: 32,
        padding: 40,
        // paddingLeft: 48,
        alignSelf: 'flex-start',
        flex: 1,
    },
    star: {
        fontSize: 32,
        paddingRight: 32,
        alignSelf: 'flex-end',
        flex: 1,
    }
};

export function listSeparator() {
    return <View style={styleSheet.listSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.1)" />;
}
