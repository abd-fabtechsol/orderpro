import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { useTheme } from '../../context/ThemeContext';
import { hp, wp } from '../../constants/dimension';

const CustomAlert = ({
  visible,
  title,
  message,
  buttons = [],
  onClose,
  type = 'info', // 'success', 'error', 'warning', 'info', 'confirm'
}) => {
  const { colors } = useTheme();

  // Default button configuration
  const defaultButtons = buttons.length > 0 ? buttons : [
    {
      text: 'OK',
      onPress: onClose,
      style: 'default',
    },
  ];

  // Get icon color based on type
  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return '#1DBF72';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'confirm':
        return '#3B82F6';
      default:
        return colors.text;
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'confirm':
        return '?';
      default:
        return 'ℹ';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getTypeColor() + '20' },
                ]}
              >
                <AppText style={[styles.icon, { color: getTypeColor() }]}>
                  {getIcon()}
                </AppText>
              </View>

              {/* Title */}
              {title && (
                <AppText style={[styles.title, { color: colors.text }]}>
                  {title}
                </AppText>
              )}

              {/* Message */}
              {message && (
                <AppText style={[styles.message, { color: colors.text }]}>
                  {message}
                </AppText>
              )}

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {defaultButtons.map((button, index) => {
                  const isDestructive = button.style === 'destructive';
                  const isCancel = button.style === 'cancel';

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.button,
                        defaultButtons.length === 1 && styles.singleButton,
                        isDestructive && styles.destructiveButton,
                        isCancel && [styles.cancelButton, { backgroundColor: colors.cardColor }],
                        !isCancel && !isDestructive && { backgroundColor: getTypeColor() },
                      ]}
                      onPress={() => {
                        button.onPress?.();
                        if (!button.preventClose) {
                          onClose?.();
                        }
                      }}
                    >
                      <AppText
                        style={[
                          styles.buttonText,
                          isCancel && { color: colors.text },
                          !isCancel && { color: '#FFFFFF' },
                        ]}
                      >
                        {button.text}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: wp(85),
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleButton: {
    flex: 1,
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
