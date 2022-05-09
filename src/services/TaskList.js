import request from "@/utils/request";

/**
 * get all tasks
 */
export const getAllTasks = async () => {
    // MLDA-EEE 
    return request.get('http://192.168.0.103:8000/taskList/getTaskList')
    //return request.get('http://192.168.43.204:8000/taskList/getTaskList')
    // return request.get('/api/tasklist')
}

/**
 * get all tasks
 */
 export const getTaskDetails = async ({taskID,taskName}) => {
    return request.get('http://192.168.0.103:8000/taskList/getTaskDetails',{params:{
        taskID:taskID,taskName:taskName
    }})
    // return request.get('/api/tasklist')
}

/**
 * upload form
 */
export const uploadTask = async (data) => {
    return request.post('http://192.168.0.103:8000/taskList/createNewTask', {data})
}

/**
 * restart task
 */
export const restartTask = async (data) => {
    return request.put('/api/restarttask',{data})
}

/**
 * stop task
 */
export const stopTask = async (data) => {
    return request.put('/api/stoptask',{data})
}

/**
 * download result of pen testing
 */
export const downLoad = async (data) => {
    return request.post('/api/download', {data})
}