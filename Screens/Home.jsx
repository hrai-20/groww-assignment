import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import Skeleton from '../components/Skeleton';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch, faStar} from '@fortawesome/free-solid-svg-icons';

const Home = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(true);
  const [topGainer, setTopGainer] = useState([]);
  const [topLoser, setTopLoser] = useState([]);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [activeTab, setActiveTab] = useState('Top Gainers');

  const handleOnStockClick = async ({ticker}) => {
    try {
      const res = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=UM6Q5QPBBLQ2BFSR`,
      );
      const stockDetail = res.data || {};
      if (res?.data) {
        navigation.navigate('stock_detail', {
          stockDetail: stockDetail,
        });
      } else {
        throw new Error('No data found');
      }
    } catch (error) {
      console.error('Failed to fetch stock details:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url =
        'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=UM6Q5QPBBLQ2BFSR';
      try {
        const res = await axios.get(url);
        if (res.data.Information) {
          const data = DATA;
          setTopGainer(data.top_gainers);
          setTopLoser(data.top_losers);
        } else {
          const data = res.data;
          setTopGainer(data.top_gainers);
          setTopLoser(data.top_losers);
        }
      } catch (error) {
        setSomethingWentWrong(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer(isDarkMode)}
      onPress={() => {
        handleOnStockClick({ticker: item.ticker});
      }}>
      <FontAwesomeIcon icon={faStar} style={styles.itemLogo} size={50} />
      <Text style={styles.itemName(isDarkMode)}>{item.ticker}</Text>
      <Text style={styles.itemPrice(isDarkMode)}>{`$${item.price}`}</Text>
      <Text style={styles.itemChange(activeTab)}>
        {(() => {
          const percentage = parseFloat(item.change_percentage);
          return percentage > 0
            ? `+${percentage.toFixed(2)}%`
            : `${percentage.toFixed(2)}%`;
        })()}
      </Text>
    </TouchableOpacity>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => setActiveTab('Top Gainers')}>
        <Text style={styles.tabText(activeTab === 'Top Gainers')}>
          Top Gainers
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab('Top Losers')}>
        <Text style={styles.tabText(activeTab === 'Top Losers')}>
          Top Losers
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container(isDarkMode)}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText(isDarkMode)}>Stock App</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}>
          <FontAwesomeIcon
            icon={faSearch}
            color={isDarkMode ? '#fff' : '#000'}
            size={24}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Skeleton />
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={activeTab === 'Top Gainers' ? topGainer : topLoser}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingVertical: hp(2)}}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {renderTabBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: isDarkMode => ({
    flex: 1,
    backgroundColor: isDarkMode ? '#202020' : '#fff',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  }),
  listContainer: {
    flex: 1,
    position: 'relative',
    marginBottom: hp(7),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: isDarkMode => ({
    color: isDarkMode ? '#fff' : '#000',
    fontWeight: '800',
    fontSize: 28,
  }),
  itemContainer: isDarkMode => ({
    width: wp(43),
    height: wp(50),
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: isDarkMode ? '#fff' : '#ccc',
    backgroundColor: isDarkMode ? '#424242' : '#f8f8f8',
    justifyContent: 'space-between',
  }),
  itemLogo: {
    padding: wp(10),
    borderRadius: wp(10),
    backgroundColor: 'grey',
    color: 'teal',
  },
  itemName: isDarkMode => ({
    color: isDarkMode ? '#fff' : '#000',
    fontWeight: 'bold',
  }),
  itemPrice: isDarkMode => ({
    color: isDarkMode ? '#fff' : '#000',
  }),
  itemChange: activeTab => ({
    color: activeTab === 'Top Gainers' ? 'green' : 'red',
  }),
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabText: isActive => ({
    fontWeight: isActive ? 'bold' : 'normal',
    fontSize: 18,
    color: isActive ? '#000' : '#888',
  }),
});

export default Home;
