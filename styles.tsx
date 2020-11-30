import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from './components/Themed';

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
        width: '100%',
    },
    searchBar: {
        height: 50,
        fontSize: 30,
        width: '100%',
        textAlign: 'center',
    },
    shortListSeparator: {
        marginVertical: 10,
        height: 2,
        width: '75%',
        alignSelf: 'center',
    },
    sprite: {
        height: 32,
        width: 32,
        padding: 40,
        alignSelf: 'flex-start',
        flex: 1,
    },
    star: {
        fontSize: 32,
        paddingRight: 32,
        alignSelf: 'flex-end',
        flex: 1,
    },
    favEntry: {
        flexDirection: 'column',
        alignContent: 'center',
        marginBottom: 20,
    },
    favHeader: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    favHeaderText: {
        fontSize: 32,
        alignSelf: 'center',
    },
    favImage: {
        padding: 100,
        alignSelf: 'center',
        flex: 1,
    },
    removeButton: {
        fontSize: 15,
        backgroundColor: '#eb2653',
        marginVertical: 5,
        padding: 8,
        borderRadius: 5,
        alignSelf: 'center'
    },
    removeButtonText: {
        color: '#e1edeb',
    },
    types: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    type: {
        width: '25%',
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        color: '#e1edeb',
    },
    typeSmall: {
        minWidth: '14%',
        fontSize: 8,
        textAlign: 'center',
        paddingVertical: 4,
        borderRadius: 5,
        color: '#e1edeb',
    },
    detailVariationsRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: 20,
        marginTop: 10,
    },
    detailVariationsColumn: {
        flexDirection: 'column',
    },
    detailVariationsImage: {
        padding: 50,
        alignSelf: 'center',
    },
    detailVariationsTitle: {
        fontSize: 10,
        alignSelf: 'center',
    },
    baseStats: {
        flexDirection: 'column',
    },
    baseStatsRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        height: 42,
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        width: '100%',
    },
    baseLabel: {
        fontSize: 16,
        paddingLeft: 20,
        maxWidth: 150,
        flex: 1,
    },
    baseStat: {
        flex: 1,
        maxWidth: 50,
    },
};

export function ListSeparator() {
    return <View style={styleSheet.listSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.1)" />;
}
