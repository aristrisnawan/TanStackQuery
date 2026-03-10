import { getTodos, Todo } from '@/api/todo';
import { useQuery } from '@tanstack/react-query';
import { FlatList, ListRenderItem, StyleSheet, Text } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  const {data: todos, isPending, error} = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  })

  if(isPending) return <Text style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>Loading...</Text>
  if(error) return <Text>Error: {error.message}</Text>

  const renderTodo: ListRenderItem<Todo> = ({item}) => (
    <Text>{item.title}</Text>
  )
  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 16
    }}>
      <FlatList
      data={todos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
