import axios from 'axios';
import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import styles from './styles/TaskCard.module.css'



function TaskCard({item, index, deleteFunc}) {
    const HandleDelete = (event) => {
        event.stopPropagation();
        deleteFunc()
    }
    return (
        <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className={styles.card}>
                        <p className={styles.title}>{item.title}</p>
                        <p className={styles.description}>{item.description}</p>
                        <button className={styles.deleteButton} onClick={HandleDelete}>DELETE</button>
                    </div>
                </div>
            )}
            
        </Draggable>
    )
}

export default TaskCard
