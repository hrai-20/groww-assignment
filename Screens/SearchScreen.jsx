// SearchScreen.js
import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  FlatList,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const SearchScreen = ({navigation}) => {
  const searchInputRef = useRef(null);
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchResults, filter]);

  const handleSearch = async query => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=UM6Q5QPBBLQ2BFSR`,
        );
        setSearchResults(response.data.bestMatches || []);
      } catch (error) {
        console.error('Failed to fetch search results:', error.message);
      }
    } else {
      setSearchResults([]);
    }
  };

  const filterResults = () => {
    if (filter === 'All') {
      setFilteredResults(searchResults);
    } else if (filter === 'Stocks') {
      setFilteredResults(
        searchResults.filter(result => result['3. type'] === 'Equity'),
      );
    } else if (filter === 'ETFs') {
      setFilteredResults(
        searchResults.filter(result => result['3. type'] === 'ETF'),
      );
    } else {
      setFilteredResults(
        searchResults.filter(
          result =>
            result['3. type'] !== 'Equity' && result['3. type'] !== 'ETF',
        ),
      );
    }
  };

  const handleOnStockClick = async ticker => {
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

  const renderResultItem = ({item}) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleOnStockClick(item['1. symbol'])}>
      <Text style={styles.resultText(isDarkMode)}>{item['2. name']}</Text>
      <Text style={styles.resultText(isDarkMode)}>{item['1. symbol']}</Text>
      <Text style={styles.resultText(isDarkMode)}>{item['3. type']}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container(isDarkMode)}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={24}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput(isDarkMode)}
          placeholder="Search for a ticker..."
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.filterContainer}>
        {['All', 'Stocks', 'ETFs', 'Other'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(type)}>
            <Text
              style={[
                styles.filterButtonText,
                filter === type && styles.activeFilterButtonText,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderResultItem}
        contentContainerStyle={styles.resultsContainer}
      />
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  backButton: {
    marginRight: wp(2),
  },
  searchInput: isDarkMode => ({
    flex: 1,
    height: 40,
    borderColor: isDarkMode ? '#555' : '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    backgroundColor: isDarkMode ? '#333' : '#f8f8f8',
  }),
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(2),
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeFilterButton: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#000',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  resultsContainer: {
    paddingBottom: hp(2),
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultText: isDarkMode => ({
    color: isDarkMode ? '#fff' : '#000',
  }),
});

export default SearchScreen;
