import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import Todo from './Todo';
import FinishedTodo from "./FinishedTodo.js";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore"; 
import { uid } from "uid";

function TodoList() {

    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();
    const uidd = uid()

    
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(!user) {
                navigate('/')
            }
        })
    }, [])

    const addToDb = async (toAdd) => {
        try {
            const docRef = await addDoc(collection(db, `/${auth.currentUser.email}/${toAdd.id}/${uidd}`), {
                todos: toAdd,
                uidd: uidd
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          
    }

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigate('/')
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const addToDo = async todo => {
        if (!todo.title || /^\s*$/.test(todo.title)) {
            return
        }
        const newToDos = [
            ...todos,
            todo
        ]
        setTodos(newToDos) 
        addToDb(todo)     
    };

    const markDone = id => {
        let updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.isDone = !todo.isDone
            }
            return todo;
        });
        setTodos(updatedTodos)
    }

    const deleteTodo = async id => {
        let updatedTodos = todos.filter(todo => todo.id !== id);

        setTodos(updatedTodos);
    }

    const setActive = id => {
        let updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.isActive = !todo.isActive
            }
            return todo;
        });
        setTodos(updatedTodos);
    }

    const unfinishedToDos = todos.filter(todo => !todo.isDone);
    const finishedToDos = todos.filter(todo => todo.isDone);

    const checkEmpty = (arr) => {
        if (!arr.length) {
            return 'empty'
        }
    }

    return (
        <div className="todo-list">
            <button onClick={handleSignOut}>SignOut</button>
            <TodoForm onSubmit={addToDo} />
            <div className="todos unfinished-todos" id={checkEmpty(unfinishedToDos)}>
                {unfinishedToDos.map(todo => {
                    const title = todo.title
                    const notes = todo.notes
                    const dueDate = todo.dueDate
                    const dueTime = todo.dueTime
                    const isDone = todo.isDone
                    const id = todo.id
                    const isActive = todo.isActive
                    return (
                        <Todo
                            markDone={markDone}
                            deleteTodo={deleteTodo}
                            setActive={setActive}
                            id={id}
                            isDone={isDone}
                            title={title}
                            notes={notes}
                            dueDate={dueDate}
                            dueTime={dueTime}
                            isActive={isActive}
                        />
                    )
                })}
            </div>
            <div className="todos finished-todos" id={checkEmpty(finishedToDos)}>
                {finishedToDos.map(todo => {
                    const title = todo.title
                    const isDone = todo.isDone
                    const id = todo.id
                    const notes = todo.notes
                    const dueDate = todo.dueDate
                    const dueTime = todo.dueTime
                    return (
                        <FinishedTodo
                            markDone={markDone}
                            deleteTodo={deleteTodo}
                            id={id}
                            isDone={isDone}
                            title={title}
                            notes={notes}
                            dueDate={dueDate}
                            dueTime={dueTime}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default TodoList