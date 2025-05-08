import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useFocusEffect } from 'expo-router';
import { getStats } from '@/database/db';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  // Load stats when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      const stats = await getStats();
      setStats(stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <Text style={[
        styles.title,
        { color: Colors[colorScheme ?? 'light'].text }
      ]}>
        Task Statistics
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={[
          styles.statCard,
          { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB' }
        ]}>
          <IconSymbol 
            name="list.bullet" 
            size={32} 
            color={Colors[colorScheme ?? 'light'].tint} 
          />
          <Text style={[
            styles.statValue,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>
            {stats.total}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: Colors[colorScheme ?? 'light'].icon }
          ]}>
            Total Tasks
          </Text>
        </View>
        
        <View style={[
          styles.statCard,
          { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB' }
        ]}>
          <IconSymbol 
            name="checkmark.circle" 
            size={32} 
            color='#10B981' 
          />
          <Text style={[
            styles.statValue,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>
            {stats.completed}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: Colors[colorScheme ?? 'light'].icon }
          ]}>
            Completed
          </Text>
        </View>
        
        <View style={[
          styles.statCard,
          { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB' }
        ]}>
          <IconSymbol 
            name="clock" 
            size={32} 
            color='#F59E0B' 
          />
          <Text style={[
            styles.statValue,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>
            {stats.pending}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: Colors[colorScheme ?? 'light'].icon }
          ]}>
            Pending
          </Text>
        </View>
      </View>
      
      <View style={[
        styles.completionCard,
        { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB' }
      ]}>
        <Text style={[
          styles.completionTitle,
          { color: Colors[colorScheme ?? 'light'].text }
        ]}>
          Task Completion Rate
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={[
            styles.progressBar,
            { backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }
          ]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                  backgroundColor: Colors[colorScheme ?? 'light'].tint
                }
              ]} 
            />
          </View>
          <Text style={[
            styles.progressText,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>
            {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  completionCard: {
    padding: 20,
    borderRadius: 10,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
});