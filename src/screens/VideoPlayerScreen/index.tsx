import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import { RouteProp, useRoute } from '@react-navigation/native';

type VideoPlayerScreenRouteProp = RouteProp<{ params: { videoPath: string } }, 'params'>;

const VideoPlayerScreen = () => {
  const route = useRoute<VideoPlayerScreenRouteProp>();
  const { videoPath } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: `file://${videoPath}` }}
        style={styles.video}
        controls={true}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayerScreen;
