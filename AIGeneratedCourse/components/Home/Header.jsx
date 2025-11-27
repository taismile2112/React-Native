import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import {UserDetailContext} from '../../context/UserDetailContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';
export default function Header() {
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    return (
    <View style = {{
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }}>
        <View>
            <Text style = {{
            fontFamily: 'outfit-bold',
            fontSize: 22,
            color: Colors.WHITE,
            }}>Hello, {userDetail?.name}</Text>

            <Text style = {{
                fontFamily: 'outfit',
                fontSize: 17,
                color: Colors.WHITE
            }}>Let's Get started!</Text>
        </View>

        <TouchableOpacity>
            <Ionicons name="settings-outline" size={32} color="black" />
        </TouchableOpacity>
        
    </View>
  )
}