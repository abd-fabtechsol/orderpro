import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Platform, ActionSheetIOS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/authSlice';
import { useLoading } from '../../context/LoadingContext';
import apiClient from '../../api/apiClient';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import AppInput from '../../components/common/AppInput';
import { hp, wp } from '../../constants/dimension';
import io from "../../../assets/io.png"
import phone from "../../../assets/phone.png"
import email from "../../../assets/email.png"
import Imageprofile from "../../../assets/Image-profile.png";
import camra from "../../../assets/camra.png";
import AppButton from '../../components/common/AppButton';

const EditProfileScreen = () => {
  const dispatch = useDispatch();
  const { showLoading, hideLoading } = useLoading();
  const user = useSelector(state => state.auth.user);

  const [name, setName] = useState(user?.name || user?.username || '');
  const [emailValue, setEmailValue] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || user?.phone_number || '');
  const [profileImage, setProfileImage] = useState(null);

  // Request permissions and pick image
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and photo library permissions are required to upload a profile picture.');
      return false;
    }
    return true;
  };

  const pickImageFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0]);
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0]);
    }
  };

  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            pickImageFromCamera();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Profile Picture',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: pickImageFromCamera },
          { text: 'Choose from Gallery', onPress: pickImageFromGallery },
        ],
        { cancelable: true }
      );
    }
  };

  const handleUpdateProfile = async () => {
    // Validation
    if (!name || name.trim().length === 0) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!emailValue || emailValue.trim().length === 0) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    showLoading('Updating profile...');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', emailValue.trim());

      // Add profile image if selected
      if (profileImage) {
        const uri = Platform.OS === 'ios' ? profileImage.uri.replace('file://', '') : profileImage.uri;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        const imageData = {
          uri: Platform.OS === 'android' ? uri : 'file://' + uri,
          name: filename,
          type: type,
        };

        formData.append('dp', imageData);
        console.log('Updating profile with image:', imageData);
      } else {
        console.log('Updating profile without image');
      }

      const result = await apiClient.patch('users/update_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile Update Result:', JSON.stringify(result));

      if (result.ok) {
        // Update user data in Redux
        // API returns nested structure: { success, message, data: { user data } }
        if (result.data?.data) {
          dispatch(setUser(result.data.data));
        } else if (result.data) {
          dispatch(setUser(result.data));
        }

        Alert.alert('Success', 'Profile updated successfully!');
        setProfileImage(null); // Clear selected image after successful update
      } else {
        const errorMessage = result.data?.message || result.data?.error || 'Failed to update profile. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Profile Update Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      hideLoading();
    }
  };

  // Get current profile image
  const currentProfileImage = profileImage
    ? { uri: profileImage.uri }
    : user?.dp
    ? { uri: user.dp }
    : user?.profile_image
    ? { uri: user.profile_image }
    : user?.image
    ? { uri: user.image }
    : Imageprofile;

  console.log('Current user in EditProfile:', JSON.stringify(user, null, 2));
  console.log('Profile image source:', currentProfileImage);

  return (
    <AppView style={styles.container}>
      <View style={{flex:1}}>
<Header title="Profile"/>
      {/* <View style={styles.avatarContainer}>
        <Image source={pic} style={styles.avatar} />
      </View> */}

<View style={styles.profileImageContainer}>
  
        <Image
          source={currentProfileImage}
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={handleImagePicker}>
          {/* <Feather name="camera" size={18} color="#000" /> */}
          <Image source={camra} style={[styles.cameraIcon,{width: 40, height: 40}]} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <AppInput
        icon={io}
        placeholder="Business or personal name"
        value={name}
        onChangeText={setName}
      />
      <AppInput
        icon={phone}
        placeholder="Phone number"
        value={phoneNumber}
        editable={false}
      />
      <AppInput
        icon={email}
        placeholder="Enter your email"
        value={emailValue}
        onChangeText={setEmailValue}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      </View>
      <AppButton
        title="Update profile"
        onPress={handleUpdateProfile}
      />
    </AppView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: wp(50), height: wp(50), borderRadius: 40 ,marginTop:hp(5)},
  input: {
    
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  updateBtn: {
    backgroundColor: '#1DBF72',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateText: { color: '#fff', fontWeight: '400', fontSize: 18 },
  profileImageContainer: {
    alignSelf: "center",
    marginVertical: hp(4),
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
  },
  cameraIcon: {
    position: "absolute",
    bottom: -4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
});
