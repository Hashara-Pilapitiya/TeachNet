import { ScrollView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import {
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'
import { useFonts, Raleway_700Bold, Raleway_600SemiBold } from '@expo-google-fonts/raleway'
import {
    AntDesign,
    Entypo,
    FontAwesome,
    Fontisto,
    Ionicons,
    SimpleLineIcons
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { responsiveWidth } from 'react-native-responsive-dimensions'


export default function SignUpScreen() {

    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
    const [buttonSpinner, setButtonSpinner] = React.useState(false)
    const [userInfo, setUserInfo] = React.useState({
        name: '',
        email: '',
        password: ''
    })
    const [required, setRequired] = React.useState('')
    const [error, setError] = React.useState({
        password: '',
    })

    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Nunito_600SemiBold,
        Raleway_600SemiBold
      });
    
      if (!fontsLoaded && !fontError) {
        return null;
      }

    const handlePasswordValidation = (value: string) => {
        const password = value;
        const passwordSpecialCharacter = /(?=.*[!@#$%^&*])/;
        const passwordOneNumber = /(?=.*[0-9])/;
        const passwordSixValues = /(?=.{6,})/;

        if(!passwordSpecialCharacter.test(password)) {
            setError({
                ...error,
                password: 'Password must contain at least one special character'
            })
            setUserInfo({...userInfo, password: ''})
        } else if(!passwordOneNumber.test(password)) {
            setError({
                ...error,
                password: 'Password must contain at least one number'
            })
            setUserInfo({...userInfo, password: ''})
        } else if(!passwordSixValues.test(password)) {
            setError({
                ...error,
                password: 'Password must contain at least six characters'
            })
            setUserInfo({...userInfo, password: ''})
        } else {
            setError({
                ...error,
                password: ''
            })
            setUserInfo({...userInfo, password: value})
        }
    }

    const handleSignUp = () => {
        router.push('/(routes)/verifyAccount')
    }

  return (
    <LinearGradient colors={['#ffffff', '#f6f7f9']} style={{flex: 1, marginTop: -40}}>

        <ScrollView>
            <Image source={require('../../../assets/signUp.jpg')} style={styles.signInImage} />

            <Text style={{fontFamily: 'Nunito_700Bold', fontSize: 24, textAlign: 'center'}}>Let's get started!</Text>

            <Text style={{fontFamily: 'Nunito_400Regular', fontSize: 16, textAlign: 'center', color: '#7f8c8d', marginTop: 10}}>Create an account to join with us.</Text>

            <View style={styles.inputContainer}>
                <View style={styles.input}>

                    <AntDesign name='user' size={24} color='white' style={{position: 'absolute', left: 10}} />
                    <TextInput placeholder='John Doe' style={{fontFamily: 'Nunito_700Bold', fontSize: 14, color: 'white', marginLeft: 50}} keyboardType='default' value={userInfo.name} onChangeText={(value) => setUserInfo({...userInfo, name: value})} />

                    {required && (
                        <View style={styles.errorContainer}>
                            <Entypo name='cross' size={18} color='red' />
                        </View>
                    )}

                </View>
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.input}>

                    <Fontisto name='email' size={24} color='white' style={{position: 'absolute', left: 10}} />
                    <TextInput placeholder='example@gmail.com' style={{fontFamily: 'Nunito_700Bold', fontSize: 14, color: 'white', marginLeft: 50}} keyboardType='email-address' value={userInfo.email} onChangeText={(value) => setUserInfo({...userInfo, email: value})} />

                    {required && (
                        <View style={styles.errorContainer}>
                            <Entypo name='cross' size={18} color='red' />
                        </View>
                    )}

                </View>

            </View>

            <View style={styles.inputContainer}>
                <View style={styles.input}>        
                        <SimpleLineIcons name='lock' size={22} color='white' style={{position: 'absolute', left: 10}} />
                        <TextInput placeholder='*******' style={{fontFamily: 'Nunito_700Bold', fontSize: 14, color: 'white', marginLeft: 50}} keyboardType='default' secureTextEntry={!isPasswordVisible} defaultValue=''  onChangeText={handlePasswordValidation} />

                        <TouchableOpacity style={styles.visibleIcon}  onPress={() => setIsPasswordVisible(!isPasswordVisible)}>

                            {!isPasswordVisible ? (
                                <Ionicons name='eye-off' size={24} color='white' style={{marginTop: -10}} />
                            ) : (
                                    <Ionicons name='eye' size={24} color='white' style={{marginTop: -10}} />
                            )}
                           
                        </TouchableOpacity>

                       
                    
                </View>
                
              

            </View>
            {error.password && (
                <View style={[styles.errorContainer1]}>
                    <Entypo name='cross' size={18} color='red' />
                        <Text style={styles.errorTxt}>{error.password}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp} >
                {
                    buttonSpinner ? (
                        <ActivityIndicator size='small' color='#ecf0f1' style={{marginTop: 10}} />
                    ) : (
                        <Text style={styles.buttonTxt}>Sign Up</Text>
                    )
                }
            </TouchableOpacity>

            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                <TouchableOpacity>
                    <FontAwesome name='google' size={24} color='black' style={{marginRight: 20}} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name='github' size={24} color='black' />
                </TouchableOpacity>
            </View>

            <View style={styles.signUpRedirect}>
                <Text style={{fontFamily: 'Nunito_400Regular', fontSize: 15, color: '#7f8c8d'}}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/(routes)/login')}>
                    <Text style={{fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#e67e22', marginLeft: 5}}>Sign In</Text>
                </TouchableOpacity>
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
        marginTop: 25,
        marginHorizontal: 20,
        backgroundColor: '#3498db',
        borderRadius: 10,
        padding: 10
    },

    input: {
        flexDirection: 'row',
        gap: 10,
        right: 10,
    },

    visibleIcon: {
        position: 'absolute',
        right: 10,
        top: 10
    },

    errorTxt: {
        fontFamily: 'Nunito_400Regular',
        fontSize: 12,
        color: 'red',
        marginLeft: 5
    },

    errorContainer: {
        position: 'absolute',
        left:20,
        flexDirection: 'row',
        alignItems: 'center',
        top: 50
    },

    errorContainer1: {
        position: 'absolute',
        left:20,
        flexDirection: 'row',
        alignItems: 'center',
        top: 570
    },

    buttonContainer: {
        backgroundColor: '#e67e22',
        width: responsiveWidth(90),
        height: 50,
        borderRadius: 5,
        marginHorizontal: 20,
        marginTop: 30
    },

    buttonTxt: {
        color: '#ecf0f1',
        fontSize: 18,
        fontFamily: 'Nunito_700Bold',
        textAlign: 'center',
        marginTop: 5,
        padding: 5
    },

    signUpRedirect: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginBottom: 20,
        marginTop: 15
    },
    
})