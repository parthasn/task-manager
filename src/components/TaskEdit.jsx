import React, {useState, useEffect} from 'react'
import styles from './styles/TaskEdit.module.css'
import axios from 'axios'


function TaskEdit({data, setShowEdit}) {
    // console.log("this",{data})
    const [ description, setDescription ] = useState("")

    useEffect(() => {
        setDescription(data.description)
    }, [data])

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleClose = () => {
        setShowEdit(false)
    }

    const handleEdit = () => {
        let id = data.id
        let body = JSON.stringify({
            "description": description
          });
          
          let config = {
            method: 'patch',
            url: `https://bristle-lace-tempo.glitch.me/tasks/${id}`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : body
          };

          axios(config)
            .then(function (response) {
                handleClose()
                return response
            })
            .catch(function (error) {
            console.log(error);
            });
    }
    return (
        <div className={styles.container}>
            <div className={styles.closeButton} onClick={handleClose}>X</div>
            <p className={styles.title}>{data.title}</p>
            <div className={styles.contentContainer}>
                <div className={styles.creatorBox}>
                    <p className={styles.createdBy}>Created By</p>
                    <p className={styles.creator}>{data.creator}</p>
                </div>
                <div className={styles.descriptionBox}>
                    <p className={styles.createdBy}>Description</p>
                    <textarea onChange={handleDescriptionChange} className={styles.description} type="text" value={description}/>
                </div>
                <button onClick={handleEdit} className={styles.editButton}>Edit</button>
            </div>
        </div>
    )
}

export default TaskEdit
