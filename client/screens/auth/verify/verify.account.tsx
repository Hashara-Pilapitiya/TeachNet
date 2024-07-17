import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Button from '../../../components/buttons/button'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { SERVER_URI } from '../../../utils/uri'
import { Toast } from 'react-native-toast-notifications'

export default function VerifyAccountScreen() {

    const [code, setCode] = React.useState(new Array(4).fill(''))

    const inputs = React.useRef<any>([...Array(4)].map(() => React.createRef()))

    const handleInput = (text: any, index: any) => {
        const newCode = [...code]
        newCode[index] = text
        setCode(newCode)

        if (text && index < 3) {
            inputs.current[index + 1].current.focus()
        }

        if (text === '' && index > 0) {
            inputs.current[index - 1].current.focus()
        }
    }

    const handleSumbit = async() => {
        const otp = code.join("")

        const activation_token = await AsyncStorage.getItem("activation_token")

        await axios
            .post(`${SERVER_URI}/activate-user`, {
                activation_token,
                activation_code: otp
            })
            .then((res: any) => {
                Toast.show("Your account activated successfully!", {
                    type: "success"
                })

                setCode(new Array(4).fill(''))
                router.push('/(routes)/login')
            })
            .catch((error) => {
                Toast.show("Your OTP is not valid or expired!", {
                    type: "danger"
                })
            })
    }

  return (
    <View style={styles.container}>

        <Text style={styles.headerTxt}>Verification Code</Text>
        <Text style={styles.subTxt}>Enter the verification code sent to your email.</Text>

        <View style={styles.inputContainer}>
            {code.map((_, index) => (
              <TextInput key={index} style={styles.inputBox} keyboardType='number-pad' maxLength={1} value={code[index]} onChangeText={(text) => handleInput(text, index)} ref={inputs.current[index]} autoFocus={index === 0} />
            ))}
        </View>

        <View>
            <Button title='Submit' onPress={handleSumbit} />
        </View>

        <TouchableOpacity onPress={() => router.back()}>
            <Text style={{fontSize: 16, paddingTop: 20, fontWeight: 500}}>Go back to Sign In</Text>
        </TouchableOpacity>
      
    </View>
  )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20
    },

    headerTxt: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 24,
        color: 'black'
    },

    subTxt: {
        fontFamily: 'Nunito_400Regular',
        fontSize: 16,
        color: '#808080',
        marginTop: 10
    },

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        marginBottom: 10
    },

    inputBox: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#3498db',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        marginRight: 10,
        marginTop: -15
    }
    
})