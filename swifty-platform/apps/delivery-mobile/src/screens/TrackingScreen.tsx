import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function TrackingScreen({ route }) {
  const [eta, setEta] = useState(15);

  // Simulate Socket.io live tracking updates
  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // Reduce ETA every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Simulated Map Widget - In production, use react-native-maps */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Live Google Maps instance running here</Text>
        <ActivityIndicator size="large" color="#e23744" style={{ marginTop: 20 }} />
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.status}>Arriving in {eta} mins</Text>
        <Text style={styles.subtext}>Your rider is almost there! 🛵</Text>

        <View style={styles.riderInfo}>
          <View style={styles.riderAvatar}><Text>👨‍🚀</Text></View>
          <View>
            <Text style={styles.riderName}>Rahul Kumar</Text>
            <Text style={styles.riderRating}>⭐ 4.8 (1,230 deliveries)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  mapPlaceholder: { flex: 1, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  mapText: { color: '#6b7280', fontSize: 16, fontWeight: 'bold' },
  bottomCard: { padding: 25, backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  status: { fontSize: 24, fontWeight: '900', color: '#111' },
  subtext: { fontSize: 15, color: '#666', marginTop: 5 },
  riderInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderColor: '#eee' },
  riderAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#feedef', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  riderName: { fontSize: 16, fontWeight: 'bold' },
  riderRating: { fontSize: 13, color: '#666', marginTop: 2 }
});
