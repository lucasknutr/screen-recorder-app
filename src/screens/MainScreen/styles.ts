import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  recordIdleButton: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: '#EF3834',
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  recordingButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#686963',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pixelPhoneImage: {
    width: width,
    height: height * 0.5
  },
  buttonContainer: {
    height: height / 4,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 50,
    backgroundColor: '#20A4F3'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  }
});
