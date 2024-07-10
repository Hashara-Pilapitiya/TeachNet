import { StyleSheet } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'


export const styles = StyleSheet.create({
    firstContainer: {
        alignItems: 'center',
        marginTop: 50
    },

    logo: {
        width: wp('50%'),
        height: hp('40%'),
    },

    titleWrapper: {
        flexDirection: 'row',
        marginTop: -20
    },

    subTitle: {
        marginTop: 10
    },

    buttonWrapper: {
        width: wp('92%'),
        alignItems: 'center',
    }
})