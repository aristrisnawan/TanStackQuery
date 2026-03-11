import { addTodo, deleteTodo, getTodos, Todo, updateTodo } from '@/api/todo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [todo, setTodo] = useState('')
  const queryClient = useQueryClient()

  const { data: todos, isPending, error } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  })

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: (data) => {
      console.log('Todo added successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (data) => {
      console.log('Todo deleted successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (data) => {
      console.log('Todo updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  const handleAddTodo = () => {
    addMutation.mutate(todo);
    setTodo('')
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleToggle = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed }
    updateMutation.mutate(updatedTodo)
    console.log('Toggling todo:', todo);
  }

  if (isPending) return <Text style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  const renderTodo: ListRenderItem<Todo> = ({ item }) => (
    <View style={styles.todoContainer}>
      <Text
        style={{
          textDecorationLine: item.completed ? 'line-through' : 'none',
          color: item.completed ? 'gray' : 'black',
        }}
        onPress={() => handleToggle(item)}>{item.title}</Text>
      <View style={{
        flexDirection: 'row',
        gap: 8
      }}>
        <Link href={{
          pathname: '/edit',
          params: {
            id: item.id
          }
        }} asChild>
          <TouchableOpacity>
            <MaterialIcons name='create' size={24} color="blue" />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={() => handleDelete(item.id.toString())}>
          <MaterialIcons name='delete' size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  )
  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 16
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8
      }}>
        <TextInput
          placeholder="Add a todo"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            padding: 8,
          }}
          value={todo}
          onChangeText={setTodo}
        />
        <TouchableOpacity onPress={handleAddTodo}>
          <MaterialIcons name='add' size={24} color='green' />
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
