import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';

const mockRestaurants = [
  { id: '1', name: 'Behrouz Biryani', rating: 4.5, eta: '35 mins', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' },
  { id: '2', name: 'Burger King', rating: 4.2, eta: '25 mins', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500' },
];

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('Tracking', { orderId: item.id })}
    >
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>⭐ {item.rating} • {item.eta}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Swifty Delivery 🛵</Text>
        <Text style={styles.location}>📍 Delivering to <Text style={{fontWeight: 'bold'}}>Koramangala</Text></Text>
      </View>
      
      <FlatList
        data={mockRestaurants}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.heading}>Recommended for you</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  greeting: { fontSize: 24, fontWeight: '900', color: '#e23744', marginTop: 10 },
  location: { fontSize: 14, color: '#666', marginTop: 5 },
  heading: { fontSize: 18, fontWeight: 'bold', marginVertical: 15, paddingHorizontal: 15 },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 15, borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 15 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
});
