import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import LineGraph from '../components/LineGraph';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faStar} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const StockDetail = ({route}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const stockDetail = route.params.stockDetail;

  const [data, setData] = useState([]);
  const [interval, setInterval] = useState('daily');
  const [loading, setLoading] = useState(true);

  const processStockData = data => {
    const timeSeriesKey = Object.keys(data).find(key =>
      key.includes('Time Series'),
    );
    const timeSeries = data[timeSeriesKey];
    const processedData = Object.keys(timeSeries)
      .map(date => ({
        value: parseFloat(timeSeries[date]['4. close']),
        date: new Date(date),
      }))
      .reverse();
    return processedData;
  };

  const fetchStockData = async (symbol, interval) => {
    let functionType;
    switch (interval) {
      case 'daily':
        functionType = 'TIME_SERIES_DAILY';
        break;
      case 'weekly':
        functionType = 'TIME_SERIES_WEEKLY';
        break;
      case 'monthly':
        functionType = 'TIME_SERIES_MONTHLY';
        break;
      default:
        functionType = 'TIME_SERIES_DAILY';
    }

    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: functionType,
          symbol: symbol,
          apikey: 'UM6Q5QPBBLQ2BFSR',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data', error);
      throw error;
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const fetchedData = await fetchStockData(stockDetail.Symbol, interval);
        const processedData = processStockData(fetchedData);
        setData(processedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [interval]);

  const formatValue = value => {
    return value && value !== 'None' ? parseFloat(value).toFixed(2) : '0';
  };

  return (
    <ScrollView
      style={styles.container(isDarkMode)}
      showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton(isDarkMode)}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={24}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text style={styles.headerText(isDarkMode)}>Details Screen</Text>
      </View>
      <View style={styles.stockHeader}>
        <FontAwesomeIcon icon={faStar} style={styles.companyLogo} size={50} />
        <View style={styles.stockInfo}>
          <Text style={styles.companyName(isDarkMode)}>{stockDetail.Name}</Text>
          <Text style={styles.stockSymbol(isDarkMode)}>
            {stockDetail.Symbol}, {stockDetail.AssetType}
          </Text>
          <Text style={styles.exchange(isDarkMode)}>
            {stockDetail.Exchange}
          </Text>
        </View>
        <View style={styles.stockPriceContainer}>
          <Text style={styles.stockPrice(isDarkMode)}>
            ${formatValue(stockDetail.AnalystTargetPrice)}
          </Text>
          <Text style={styles.stockChange(isDarkMode)}>
            {formatValue(stockDetail.QuarterlyEarningsGrowthYOY * 100)}%
          </Text>
        </View>
      </View>
      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <LineGraph lineData={data} />
        )}
      </View>
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity
          onPress={() => setInterval('daily')}
          style={styles.timeRangeButton}>
          <Text>1D</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setInterval('weekly')}
          style={styles.timeRangeButton}>
          <Text>1W</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setInterval('monthly')}
          style={styles.timeRangeButton}>
          <Text>1M</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setInterval('quarterly')}
          style={styles.timeRangeButton}>
          <Text>3M</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setInterval('semi-annual')}
          style={styles.timeRangeButton}>
          <Text>6M</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setInterval('yearly')}
          style={styles.timeRangeButton}>
          <Text>1Y</Text>
        </TouchableOpacity>
      </View>
      <PriceRange
        low={formatValue(stockDetail['52WeekLow'])}
        current={formatValue(stockDetail.AnalystTargetPrice)}
        high={formatValue(stockDetail['52WeekHigh'])}
      />
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle(isDarkMode)}>
          About {stockDetail.Name}
        </Text>
        <Text style={styles.aboutText(isDarkMode)}>
          {stockDetail.Description}
        </Text>
      </View>
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Industry: {stockDetail.Industry}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Sector: {stockDetail.Sector}</Text>
        </View>
      </View>
      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel(isDarkMode)}>Market Cap:</Text>
          <Text style={styles.metricValue(isDarkMode)}>
            {stockDetail.MarketCapitalization}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel(isDarkMode)}>PERatio:</Text>
          <Text style={styles.metricValue(isDarkMode)}>
            {formatValue(stockDetail.PERatio)}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel(isDarkMode)}>EPS:</Text>
          <Text style={styles.metricValue(isDarkMode)}>
            {formatValue(stockDetail.EPS)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const PriceRange = ({low, current, high}) => {
  const getPosition = () => {
    const lowValue = parseFloat(low);
    const highValue = parseFloat(high);
    const currentValue = parseFloat(current);

    if (highValue - lowValue === 0) {
      return '50%';
    }

    const positionPercentage =
      ((currentValue - lowValue) / (highValue - lowValue)) * 100;
    return `${positionPercentage}%`;
  };

  return (
    <View style={styles.priceRangeContainer}>
      <View style={styles.priceBarContainer}>
        <Text style={styles.priceValue}>${low}</Text>
        <Text style={styles.priceLabel}>Current price: ${current}</Text>
        <Text style={styles.priceValue}>${high}</Text>
      </View>
      <View style={styles.priceBar}>
        <View style={[styles.currentPriceIndicator, {left: getPosition()}]} />
      </View>
      <View style={styles.priceBarContainer}>
        <Text style={styles.priceLabel}>52-Week Low</Text>
        <Text style={styles.priceLabel}>52-Week High</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: isDarkMode => ({
    flex: 1,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  }),
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: isDarkMode => ({
    marginRight: wp(2),
  }),
  headerText: isDarkMode => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
  }),
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  companyLogo: {
    marginRight: wp(4),
    color: '#888',
  },
  stockInfo: {
    flex: 1,
  },
  companyName: isDarkMode => ({
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
  }),
  stockSymbol: isDarkMode => ({
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
  }),
  exchange: isDarkMode => ({
    fontSize: 14,
    color: isDarkMode ? '#ccc' : '#888',
  }),
  stockPriceContainer: {
    alignItems: 'flex-end',
  },
  stockPrice: isDarkMode => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
  }),
  stockChange: isDarkMode => ({
    fontSize: 18,
    color: isDarkMode ? '#0f0' : '#080',
  }),
  chartContainer: {
    padding: wp(4),
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: wp(4),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  timeRangeButton: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
  },
  priceRangeContainer: {
    marginVertical: hp(2),
    paddingHorizontal: wp(4),
  },
  priceBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  priceBar: {
    width: '100%',
    height: 2,
    backgroundColor: '#ccc',
    position: 'relative',
  },
  currentPriceIndicator: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    position: 'absolute',
    top: -4,
  },
  currentPriceLabel: {
    position: 'absolute',
    top: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  priceLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  aboutContainer: {
    padding: wp(4),
  },
  aboutTitle: isDarkMode => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
    marginBottom: hp(1),
  }),
  aboutText: isDarkMode => ({
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
  }),
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: wp(4),
  },
  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    borderRadius: 5,
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  tagText: {
    fontSize: 14,
    color: '#555',
  },
  metricsContainer: {
    padding: wp(4),
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
  },
  metricLabel: isDarkMode => ({
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
  }),
  metricValue: isDarkMode => ({
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
  }),
});

export default StockDetail;
