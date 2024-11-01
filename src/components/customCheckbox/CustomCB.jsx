import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomCB = () => {
    const [isChecked, setIsChecked] = useState(false);

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    return (
        <TouchableOpacity onPress={toggleCheckbox} style={styles.container}>
            <View style={[styles.checkbox, isChecked && styles.checked]}>
                {isChecked && <Text style={styles.checkmark}>✔</Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checked: {
        backgroundColor: '#007bff',
    },
    checkmark: {
        color: 'white',
        fontSize: 12,
    },
    label: {
        fontSize: 18,
    },
});

export default CustomCB;
