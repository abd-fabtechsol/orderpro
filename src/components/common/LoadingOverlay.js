import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLoading } from '../../context/LoadingContext';
import { useTheme } from '../../context/ThemeContext';
import AppText from './AppText';

const LoadingOverlay = () => {
    const { isLoading, loadingMessage } = useLoading();
    const { colors } = useTheme();

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isLoading}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={[styles.loadingContainer, { backgroundColor: colors.cardColor }]}>
                    <ActivityIndicator size="large" color="#1DBF72" />
                    <AppText style={[styles.loadingText, { color: colors.text }]}>
                        {loadingMessage}
                    </AppText>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default LoadingOverlay;
