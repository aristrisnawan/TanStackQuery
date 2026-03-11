import { getTodoById, updateTodo } from "@/api/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Edit = () => {
    const [todo, setTodo] = useState('')
    const { id } = useLocalSearchParams()
    const queryClient = useQueryClient()
    const { data, isPending, error } = useQuery({
        queryKey: ['todo', id],
        queryFn: () => getTodoById(id.toString())
    })

    useEffect(() => {
        if (data) {
            setTodo(data.title)
        }
    }, [data])

    const editMutation = useMutation({
        mutationFn: updateTodo,
        onSuccess: (data) => {
            console.log('Todo updated successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['todos'] })
            router.back()
        }
    })

    const handleUpdate = () => {
        editMutation.mutate({
            id: Number(id),
            title: todo,
            completed: false
        })
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16
        }}>
            <TextInput
                placeholder="Edit todo"
                value={todo}
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 8,
                    marginBottom: 16,
                    width: '100%',
                    borderRadius: 4
                }}
                onChangeText={setTodo}
            />
            <TouchableOpacity onPress={handleUpdate}>
                <Text>Save</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Edit;