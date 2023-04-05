import React, {useState, useEffect} from 'react'
import styles from './styles/Tasks.module.css'
import projects from '../projects.svg';
import logout from '../logout.svg';
import profile from '../profile.svg';
import { json, useNavigate } from "react-router-dom"
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import { v4 as uuid } from "uuid";
import TaskCard from './TaskCard';
import TaskEdit from './TaskEdit';


function Tasks() {
    const [ userData, setUserData ] = useState("")
    const [ taskTitle, setTaskTitle ] = useState("")
    const [ taskDescription, setTaskDescription ] = useState("")
    const [ tasksList, setTasksList ] = useState([])
    const [ showEdit, setShowEdit ] = useState(false)
    const [ editData, setEditData ] = useState({})
    const [ tasks, setTasks ] = useState(0)
    const [ showAddCard, setShowAddCard ] = useState("to-do")
    const [ taskCategory ] = useState([
        {
            id: 'to-do',
            title: 'To Do'
        },
        {
            id: 'in-progress',
            title: 'In Progress',
        },
        {
            id: 'completed',
            title: 'Completed',
        },
    ])

    useEffect(() => {
        async function getData(){
            let user = await JSON.parse(localStorage.getItem('user')) || await JSON.parse(sessionStorage.getItem('user'))
            setUserData(user?.userData)
                axios.get("https://bristle-lace-tempo.glitch.me/tasks")
                .then(res => {
                    // console.log(res.data)
                    setTasksList(res?.data)
                })
                .catch((err) => console.log("Something went wrong", err))
        }
        getData()
    }, [tasks, showEdit])
    
    const navigate = useNavigate()

    const handleLogout = () => {
        let flag = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
        if(flag){
            localStorage.removeItem('user')
            sessionStorage.removeItem('user')
            navigate('/', {replace: true})
            window.location.reload()
        }
        
    }
    // console.log({tasksList})

    const insert = (arr, s, d) => {

        let output = []
        let sourceElem = arr[s]
        for(let i = 0; i < arr.length; i++){
                if(i !== (s)){
                output.push(arr[i])
            }
        }
        if(d){
            output.splice(d-1, 0, sourceElem)
        }
        else{
            output.push(sourceElem)
        }
        
        return output
    }

    const handleDragEnd = (result) => {
        // console.log({result})
        if(!result.destination){
            return
        }
        const { source, destination } = result
        // console.log({source}, {destination})
        let changedArr = [...tasksList]
        let output
        if(source.droppableId === destination.droppableId){
            output = insert(changedArr, source.index, destination.index+1)

        }
        else{
            changedArr.forEach((item) => {
                if(item.id === result.draggableId){
                    item.type = result?.destination?.droppableId
                    output = insert(changedArr, source.index)
                }
            })
            
        }

        setTasksList(output || changedArr)
        let payload = output || changedArr
        let promises = []
        payload?.forEach(async(item) => {
            let res = new Promise((resolve, reject) => {
                axios.delete(`https://bristle-lace-tempo.glitch.me/tasks/${item.id}`)
                .then(res => resolve(res))
                .catch(err => reject(err))
            })
            promises.push(res)
        })
        // console.log({promises})
        Promise.all(promises)
            .then((res) => {
                // console.log({res})
                payload?.forEach(async(item) => {
                // console.log({item})
                var config = {
                    method: 'post',
                    url: 'https://bristle-lace-tempo.glitch.me/tasks',
                    headers: { 
                    'Content-Type': 'application/json'
                    },
                    data : JSON.stringify(item)
                };
                
                await axios(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
                
            })
        })
        
        

    }

    const handleTitleChange = (e) => {
        setTaskTitle(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        setTaskDescription(e.target.value)
    }

    const handleAddButton = (type) => {
        setShowAddCard(type)
    }

    const handleAdd = (type) => {
        if(taskTitle && taskDescription){
            
            let task = {
                id: uuid(),
                index: tasksList?.length > 0 ? tasksList?.length+1 : 1,
                type: type,
                title: taskTitle,
                description: taskDescription,
                creator: userData?.fullName
            }
            axios.post("https://bristle-lace-tempo.glitch.me/tasks", {...task})
            .then(res => {
                setTaskTitle("")
                setTaskDescription("")
                setTasks(tasks+1)
            })
            .catch(err => console.log(err))
            
        }
        

    }

    const handleTaskInfo = (data) => {
        // console.log({data})
        setShowEdit(true)
        setEditData(data)
    }

    const deleteFunc = (id) => {
        
        // console.log('in here')
        axios.delete(`https://bristle-lace-tempo.glitch.me/tasks/${id}`)
        .then(res => setTasks(tasks+1))
        .catch(err => console.log(err))
    }
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <div className={styles.header}>
                        <p>TASK MANAGER</p>
                        <div className={styles.sections}>
                            <div className={styles.sectionBox} style={{borderRight: '4px solid #329C89'}}>
                                <img src={projects} className={styles.icon} alt="projects"/>
                                <p className={styles.title} style={{color: '#212121'}}>Projects</p>
                            </div>
                            <div onClick={handleLogout} className={styles.logout}>
                                <img src={logout} className={styles.icon} alt="logout"/>
                                <p className={styles.title} style={{color: '#9A9A9A'}}>Log Out</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.navbar}>
                        <div className={styles.profileWidget}>
                            <p className={styles.userName}>Hi {userData?.fullName}</p>
                            <img src={profile} className={styles.profileImage} alt="Profile"/>
                        </div>
                    </div>
                    <div className={styles.mainContainer}>
                        <p className={styles.heading}>Projects</p>
                        <DragDropContext
                            onDragEnd={handleDragEnd}
                        >
                            <div className={styles.taskContainer}>
                                {
                                    taskCategory.map((item, index) => (
                                        <div key={index} className={styles.taskBox}>
                                            <div className={styles.taskHeader}>
                                                <p className={styles.taskTitle}>{item.title}</p>
                                                <div className={styles.count}>
                                                    {
                                                        tasksList?.filter(elem => elem.type === item.id).length
                                                    }
                                                </div>
                                            </div>
                                            <div onClick={() => handleAddButton(item.id)} className={styles.addTask}>
                                                <p className={styles.add}>+</p>
                                            </div>
                                            {
                                                item.id === showAddCard ? (
                                                    <div className={styles.taskForm}>
                                                        <input onChange={handleTitleChange} value={taskTitle} type="text" className={styles.titleInput} placeholder="Give your task a title"/>
                                                        <textarea onChange={handleDescriptionChange} value={taskDescription} rows="4" type="text" className={styles.description} placeholder="Description"/>
                                                        <button className={styles.addButton} onClick={() => handleAdd(item.id)}>ADD</button>
                                                    </div>
                                                ) : null
                                            }
                                            <Droppable   droppableId={item.id}>
                                                {(provided) => (
                                                    <div 
                                                        className={styles.dropArea}
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
                                                        
                                                        {
                                                            tasksList && tasksList.map((elem, id) => (
                                                                <div key={elem.index} onClick={() => handleTaskInfo(elem)}>
                                                                    
                                                                    {
                                                                        elem.type === item.id ? (
                                                                            <div>
                                                                            <TaskCard item={elem} index={id} deleteFunc={(event) => deleteFunc(elem.id)}/>
                                                                            </div>
                                                                            
                                                                        ) : null
                                                                    }
                                                                    
                                                                </div>
                                                                
                                                            ))
                                                        }
                                                        
                                                        {provided.placeholder}
                                                    </div>
                                                    
                                                )}
                                            </Droppable>
                                        </div>
                                        
                                    ))
                                }
                            </div>
                        </DragDropContext>
                        {
                            showEdit ? (
                                <div className={styles.editCard}>
                                    <TaskEdit data={editData} setShowEdit={setShowEdit}/>
                                </div>
                                
                            ) : null
                        }
                    </div>
                
                </div>
            </div>
        </div>
        
    )
}

export default Tasks
