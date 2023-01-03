// import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

export default async function downloadImage(imageUrl, text = 'new_file') {
  // const { status } = await CameraRoll.requestPermissionsAsync();
  const status = Platform.OS === 'android' && !(await hasAndroidPermission());
  if (status) {
    RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: `${RNFS.DocumentDirectoryPath}/wallpaper_image_${text}.png`,
      progress: downloadProgress => {
        console.log(
          `Download progress- ${downloadProgress.bytesWritten} / ${downloadProgress.contentLength}`,
        );
      },
      begin: red => {
        console.log({ red });
      },
    });
  }
}

async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

// export async function savePicture(url) {
//   if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
//     return;
//   }

//   CameraRoll.save(url);
// }
