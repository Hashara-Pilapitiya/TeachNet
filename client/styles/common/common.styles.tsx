import { StyleSheet } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonContainer: {
        backgroundColor: '#e67e22',
        width: responsiveWidth(88),
        height: responsiveWidth(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },

    buttonTxt: {
        color: '#ecf0f1',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        textAlign: 'center'
    },

    dotStyle: {
        backgroundColor: '#e67e22',
        width: responsiveWidth(2.5),
        height: responsiveWidth(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },

    activedotStyle: {
        backgroundColor: '#e67e22',
        width: responsiveWidth(2.5),
        height: responsiveWidth(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },
})