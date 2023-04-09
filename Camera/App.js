import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const photoData = await cameraRef.current.takePictureAsync(options);
      setPhoto(photoData);
    }
  };

  const resetCamera = () => {
    setPhoto(null);
  };

  return (
    <View style={styles.container}>
      {hasPermission ? (
        photo ? (
          <View style={styles.photoContainer}>
            <Text style={styles.photoText}>Here's your photo:</Text>
            <TouchableOpacity style={styles.photoButton} onPress={resetCamera}>
              <Text style={styles.photoButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={() => alert('Photo sent!')}>
              <Text style={styles.photoButtonText}>Send</Text>
            </TouchableOpacity>
            <View style={styles.photoPreview}>
              <Text>Preview:</Text>
              <View style={styles.photoPreviewImage}>
                <Image source={{ uri: photo.uri }} style={styles.photoPreviewImage} />
              </View>
            </View>
          </View>
        ) : (
          <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
            <View style={styles.cameraButtons}>
              <TouchableOpacity style={styles.cameraButton} onPress={toggleCamera}>
                <Text style={styles.cameraButtonText}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                <Text style={styles.cameraButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        )
      ) : (
        <Text>No access to camera</Text>
      )}
    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraButtons: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cameraButtonText: {
    fontSize: 16
  },
  photoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 24,
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  photoButtonText: {
    fontSize: 16,
  },
  photoPreview: {
    marginVertical: 20,
  },
  photoPreviewImage: {
    width: 200,
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
});