import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { useRoute } from '@react-navigation/native';

const VideoPlayerScreen = () => {
  const route = useRoute();
  const { videoUri } = route.params; // pegar a uri do video da RecordingsListScreen

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayerScreen;
