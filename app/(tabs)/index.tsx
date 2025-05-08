import { Colors } from '@/constants/Colors';
import { Todo, deleteTodo, getTodos, initDb, insertTodo, toggleTodoStatus } from '@/database/db';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize the database
  useEffect(() => {
    initDb()
      .then(() => loadTodos())
      .catch(err => console.error('Error initializing database:', err));
  }, []);

  // Refresh todos when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  const loadTodos = async () => {
    try {
      setLoading(true);
      const todoItems = await getTodos();
      setTodos(todoItems);
    } catch (err) {
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;
    
    try {
      await insertTodo(newTodo);
      setNewTodo('');
      loadTodos();
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleTodoStatus(id);
      loadTodos();
    } catch (err) {
      console.error('Error toggling todo status:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const getCompletedCount = () => {
    return todos.filter(todo => todo.completed).length;
  };

  const getPendingCount = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const renderItem = ({ item }) => (
    <Animated.View style={[
      styles.todoItem, 
      { 
        backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB',
        shadowColor: colorScheme === 'dark' ? '#000' : '#888',
      }
    ]}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => handleToggleStatus(item.id)}
      >
        {item.completed ? (
          <MaterialCommunityIcons 
            name="checkbox-marked-circle" 
            size={24} 
            color={Colors[colorScheme ?? 'light'].tint} 
          />
        ) : (
          <MaterialCommunityIcons 
            name="checkbox-blank-circle-outline" 
            size={24} 
            color={Colors[colorScheme ?? 'light'].icon} 
          />
        )}
      </TouchableOpacity>
      
      <Text 
        style={[
          styles.todoText, 
          { 
            color: Colors[colorScheme ?? 'light'].text,
            textDecorationLine: item.completed ? 'line-through' : 'none',
            opacity: item.completed ? 0.6 : 1
          }
        ]}
      >
        {item.title}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteTodo(item.id)}
      >
        <MaterialCommunityIcons 
          name="trash-can-outline" 
          size={22} 
          color={colorScheme === 'dark' ? '#FF6B6B' : '#FF4848'} 
        />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { color: Colors[colorScheme ?? 'light'].text }
        ]}>
          My Tasks
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={[
            styles.statItem, 
            { backgroundColor: colorScheme === 'dark' ? '#3B82F6' : '#DBEAFE' }
          ]}>
            <Text style={[
              styles.statNumber,
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#1E40AF' }
            ]}>
              {getPendingCount()}
            </Text>
            <Text style={[
              styles.statLabel,
              { color: colorScheme === 'dark' ? '#DBEAFE' : '#1E40AF' }
            ]}>
              Active
            </Text>
          </View>
          
          <View style={[
            styles.statItem, 
            { backgroundColor: colorScheme === 'dark' ? '#10B981' : '#D1FAE5' }
          ]}>
            <Text style={[
              styles.statNumber,
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#065F46' }
            ]}>
              {getCompletedCount()}
            </Text>
            <Text style={[
              styles.statLabel,
              { color: colorScheme === 'dark' ? '#D1FAE5' : '#065F46' }
            ]}>
              Completed
            </Text>
          </View>
        </View>
      </View>
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={[
          styles.inputWrapper,
          { 
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB',
            borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
            shadowColor: colorScheme === 'dark' ? '#000' : '#888',
          }
        ]}>
          <Ionicons 
            name="pencil" 
            size={20} 
            color={Colors[colorScheme ?? 'light'].icon} 
            style={styles.inputIcon}
          />
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors[colorScheme ?? 'light'].text,
              }
            ]}
            placeholder="Add a new task"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={handleAddTodo}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddTodo}
        >
          <LinearGradient
            colors={colorScheme === 'dark' ? 
              ['#3B82F6', '#2563EB'] : 
              ['#60A5FA', '#3B82F6']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      {/* Todo List */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: Colors[colorScheme ?? 'light'].icon }}>Loading...</Text>
        </View>
      ) : todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={require('@/assets/images/empty-tasks.png')} 
            style={styles.emptyImage}
            contentFit="contain"
          />
          <Text style={[
            styles.emptyText,
            { color: Colors[colorScheme ?? 'light'].icon }
          ]}>
            No tasks yet. Add one above!
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={[
            styles.sectionTitle,
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>
            My Tasks ({todos.length})
          </Text>
          
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginRight: 10,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    height: 55,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    paddingLeft: 15,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  addButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonGradient: {
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    paddingRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  }
});