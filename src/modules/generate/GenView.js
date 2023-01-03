/* eslint-disable class-methods-use-this */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import DocumentPicker from 'react-native-document-picker';
import FormData from 'form-data';
import publicIP from 'react-native-public-ip';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import Ids from '../../../constants';
import downloadImage from '../../api/file';
import { getVariationsFromImages } from '../../api/gpt';

export default function GenerateScreen() {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const isFocused = useIsFocused();
  const adUnitId = Ids.BANNER; // 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
  const adUnitIdInt = Ids.INTERSTITIAL; // 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

  const rewarded = RewardedAd.createForAdRequest(Ids.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing', 'images', 'ai', 'health', 'therapy'],
  });

  const interstitial = InterstitialAd.createForAdRequest(adUnitIdInt, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing', 'images', 'ai', 'health', 'therapy'],
  });

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('loaded');
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [isFocused]);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('loaded');
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [isFocused]);

  const renderItem = ({ item, id }) => (
    <ScrollView key={id} style={{ margin: 5 }}>
      <Modal visible={isModalVisible} onRequestClose={closeModal}>
        <View>
          <TouchableOpacity onPress={closeModal}>
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          openModal(item);
          setImage(item);
        }}
        onLongPress={() => downloadImage(item)}
      >
        <Image
          source={{
            uri: item,
          }}
          style={styles.image}
        />
      </TouchableOpacity>
    </ScrollView>
  );

  const uploadImage = async singleFile => {
    if (singleFile != null) {
      const fileToUpload = singleFile;
      const data = new FormData();
      const ip = await publicIP();
      data.append('ip', ip);
      data.append('file', fileToUpload[0]);

      const imageResults = await getVariationsFromImages(data);
      setImages(imageResults);
    }
    setLoading(false);
    [interstitial, rewarded][Math.round(Math.random())].show();
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    setLoading(true);
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      // setSingleFile(res);
      uploadImage(res);
    } catch (err) {
      setLoading(false);
      console.log(err);
      // // setSingleFile(null);
      // // Handling any exception (If any)
      // if (DocumentPicker.isCancel(err)) {
      //   // If user canceled the document selection
      //   // alert('Canceled');
      // } else {
      //   // For Unknown Error
      //   // alert('Unknown Error: ' + JSON.stringify(err));
      //   throw err;
      // }
    }
  };

  return (
    <View>
      <Text style={styles.mainText}>Generate Wallpaper Variations</Text>
      <View style={styles.input}>
        <TouchableOpacity style={styles.upload} onPress={selectFile}>
          <Icon name="upload" size={30} color="black" />
          <Text>Upload an Image</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{ color: 'blue', textAlign: 'center' }}
        onPress={() =>
          Linking.openURL(
            'https://www.termsfeed.com/live/49da2b68-9bd8-44fc-85f2-63d983dd8613',
          )
        }
      >
        {' '}
        Privacy Policy{' '}
      </Text>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      {images.length > 0 && !loading && (
        <View style={styles.img}>
          <Text style={styles.message}>
            Click on any image to enlarge and long press to download
          </Text>

          <FlatList
            data={images}
            renderItem={item => renderItem(item)}
            numColumns={1}
            keyExtractor={(item, k) => k}
            style={{
              paddingHorizontal: 5,
              marginTop: 15,
              width: '100%',
            }}
          />

          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}
      {loading && (
        <View style={{ marginTop: 150 }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  img: {
    marginTop: 15,
    overflow: 'scroll',
    marginBottom: 525,
  },
  message: {
    textAlign: 'center',
    marginBottom: 10,
  },
  inputBar: {
    width: 320,
    height: 70,
    margin: 5,
    borderRadius: 5,
  },
  mainText: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scroller: {
    minHeight: '100%',
    marginTop: 15,
  },
  upload: {
    backgroundColor: '#bbb',
    borderRadius: 10,
    height: 150,
    width: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagesRow: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    padding: 5,
  },
  image: {
    width: '100%',
    height: 300,
  },
});
