import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useIsFocused } from '@react-navigation/native';
import { colors, fonts } from '../../styles';
import Ids from '../../../constants';
import { getPopularImages } from '../../api/gpt';
import downloadImage from '../../api/file';

export default function GridsScreen() {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const isFocused = useIsFocused();
  const adUnitId = Ids.BANNER; // 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
  const adUnitIdInt = Ids.INTERSTITIAL; // 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

  const interstitial = InterstitialAd.createForAdRequest(adUnitIdInt, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing', 'images', 'ai', 'health', 'therapy'],
  });

  async function loadImages() {
    setLoading(true);
    const imageResults = await getPopularImages();
    setImages(imageResults);
    interstitial.show();
    setLoading(false);
  }

  useEffect(() => {
    console.log('logged');
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        loadImages();
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
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

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Latest Images</Text>
      </View>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />

      {loading && (
        <View style={{ marginTop: 150 }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {images.length > 0 && !loading && (
        <View style={styles.img}>
          <Text style={styles.message}>
            Click on any image to enlarge and long press to download
          </Text>

          <FlatList
            data={images}
            renderItem={item => renderItem(item)}
            numColumns={2}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    minHeight: '100%',
  },
  img: {
    marginTop: 15,
    overflow: 'scroll',
    marginBottom: 125,
  },
  message: {
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  smallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabsContainer: {
    alignSelf: 'stretch',
    marginTop: 30,
  },
  itemOneContainer: {
    flex: 1,
    width: Dimensions.get('window').width / 2 - 40,
  },
  itemOneImageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  itemOneImage: {
    height: 200,
    width: Dimensions.get('window').width / 2 - 40,
  },
  itemOneTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  itemOneSubTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 13,
    color: '#B2B2B2',
    marginVertical: 3,
  },
  itemOnePrice: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  itemOneRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  itemOneContent: {
    marginTop: 5,
    marginBottom: 10,
  },
  itemTwoContainer: {
    paddingBottom: 10,
    backgroundColor: 'white',
    marginVertical: 5,
  },
  itemTwoContent: {
    padding: 20,
    position: 'relative',
    marginHorizontal: Platform.OS === 'ios' ? -15 : 0,
    height: 150,
  },
  itemTwoTitle: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 20,
  },
  itemTwoSubTitle: {
    color: colors.white,
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
    marginVertical: 5,
  },
  itemTwoPrice: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 20,
  },
  itemTwoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  itemTwoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#6271da',
    opacity: 0.5,
  },
  itemThreeContainer: {
    backgroundColor: 'white',
  },
  itemThreeSubContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  itemThreeImage: {
    height: 100,
    width: 100,
  },
  itemThreeContent: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  itemThreeBrand: {
    fontFamily: fonts.primaryRegular,
    fontSize: 14,
    color: '#617ae1',
  },
  itemThreeTitle: {
    fontFamily: fonts.primaryBold,
    fontSize: 16,
    color: '#5F5F5F',
  },
  itemThreeSubtitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    color: '#a4a4a4',
  },
  itemThreeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemThreePrice: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
    color: '#5f5f5f',
    textAlign: 'right',
  },
  itemThreeHr: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3e3e3',
    marginRight: -15,
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  image: {
    width: '100%',
    height: 230,
  },
});
