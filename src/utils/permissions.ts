import { PermissionsAndroid, Platform } from 'react-native';

export const requestAllPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);

    if (
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};


export const checkPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    const writeInternalGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_INTERNAL_STORAGE);
    const recordGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    const foregroundGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE);

    return writeGranted && writeInternalGranted && recordGranted && foregroundGranted;
  }
  return true;
};
