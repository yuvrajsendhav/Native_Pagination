import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

let limit = 10;
let loadmore = true;
const Pagination = () => {
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = () => {
    setLoading(true);
    let query = `?skip=${skip}&limit=${limit}`;
    fetch('https://dummyjson.com/products' + query)
      .then(res => res.json())
      .then(res => {
        console.log('api res', res);
        if (res.products.length == 0) {
          loadmore = false;
        }
        setData([...data, ...res.products]);
        setSkip(skip + 10);
        setShowLoader(false);
        setLoading(false);
      })
      .catch(error => {
        console.log('ITS ERROR', error);
        setLoading(false);
      });
  };

  const renderItem = useCallback(
    ({item}) => {
      return (
        <View style={styles.FlatStyle}>
          <Image source={{uri: item.thumbnail}} style={styles.Imagestyle} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 8,
            }}>
            <Text>{item.brand}</Text>
            <Text>Rs.{item.price}</Text>
          </View>
          <Text>{item.description}</Text>
        </View>
      );
    },
    [data],
  );

  const keyExtractor = useCallback(item => `${item.id}`);
  const ItemSeparatorComponent = useCallback(() => {
    return <View style={{height: 20}} />;
  }, [data]);

  const onEndReached = () => {
    if (loadmore) {
      setShowLoader(true);
    }
  };

  const listFooterComponent = useCallback(() => {
    return (
      <TouchableOpacity onPress={fetchdata}>
        <Text style={styles.Seemore}>See more</Text>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <ActivityIndicator
          style={{position: 'absolute', top: 400, zIndex: 10000,  alignSelf: 'center'}}
          animating={loading}
          size="large"
          color="#00ff00"
        />

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
          onEndReached={onEndReached}
          ListFooterComponent={showLoader && listFooterComponent}
        />
      </View>
    </SafeAreaView>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
  },
  Imagestyle: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  FlatStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: 'white',
    padding: 8,
    margin: 2,
    borderRadius: 8,
  },
  Seemore:{
    color:'white',
    fontSize:25,
    marginLeft:10,
    backgroundColor:'#4f086e',
    alignSelf:'center',
    borderRadius:5
  }
});
