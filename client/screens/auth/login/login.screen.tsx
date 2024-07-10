import { ScrollView, StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'
import {
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'
import { useFonts, Raleway_700Bold, Raleway_600SemiBold } from '@expo-google-fonts/raleway'
import {
    Entypo,
    Fontisto,
    Ionicons,
    SimpleLineIcons
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'


export default function LoginScreen() {

    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
    const [buttonSpinner, setButtonSpinner] = React.useState(false)
    const [userInfo, setUserInfo] = React.useState({
        email: '',
        password: ''
    })

  return (
    <LinearGradient colors={['#ffffff', '#f6f7f9']} style={{flex: 1}}>

        <ScrollView>
            <Image source={require('../../../assets/signIn.jpg')} style={styles.signInImage} />

            <Text style={{fontFamily: 'Nunito_700Bold', fontSize: 24, textAlign: 'center'}}>Welcome Back!</Text>

            <Text style={{fontFamily: 'Nunito_400Regular', fontSize: 16, textAlign: 'center', color: '#7f8c8d', marginTop: 10}}>Sign in to continue.</Text>

            <View style={styles.inputContainer}>
                <View>
                    <TextInput placeholder='Email...' style={{fontFamily: 'Nunito_700Bold', fontSize: 14, color: 'white'}} keyboardType='email-address' value={userInfo.email} onChangeText={(value) => setUserInfo({...userInfo, email: value})} />
                </View>
            </View>

        </ScrollView>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    signInImage: {
        width: '60%',
        height: 350,
        alignSelf: 'center',
        marginTop: 50
    },

    inputContainer: {
        marginTop: 50,
        marginHorizontal: 20,
        backgroundColor: '#2980b9',
        borderRadius: 10,
        padding: 10,
        rowGap: 20
    }
})