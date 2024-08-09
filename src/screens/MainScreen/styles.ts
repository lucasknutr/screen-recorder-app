import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  recordIdleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  recordingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pixelPhoneImage: {
    width: width,
    height: height * 0.5
  },
  buttonContainer: {
    borderRadius: 2,
    borderColor: 'black',
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});
