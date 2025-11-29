import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import {UserDetailContext} from '../../context/UserDetailContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
export default function Header() {
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    return (
    <View style = {{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    }}>
        <View>
            <Text style = {{
            fontFamily: 'outfit-bold',
            fontSize: 25,
            color: Colors.WHITE,
            }}>👋 Hello, {userDetail?.name}</Text>

            <Text style = {{
                fontFamily: 'outfit',
                fontSize: 17,
                color: Colors.WHITE,
                
            }}>---Let's Get started!---</Text>
        </View>

        <TouchableOpacity>
            <Feather name="settings" size={34} color="#fff" />
        </TouchableOpacity>
        
    </View>
  )
}