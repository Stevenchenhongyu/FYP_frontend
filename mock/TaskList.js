let list = [
    {id:1,taskName: "test", taskFuzzer: "AFL", taskTimeStart: 0, taskStatus: 0},
    {id:2,taskName: "test", taskFuzzer: "AFL", taskTimeStart: 2, taskStatus: 2},
    {id:3,taskName: "test", taskFuzzer: "AFL", taskTimeStart: 0, taskStatus: 0},
    {id:4,taskName: "test", taskFuzzer: "AFL", taskTimeStart: 2, taskStatus: 0},
    {id:5,taskName: "test", taskFuzzer: "AFL", taskTimeStart: 1, taskStatus: 1},
    {id:6,taskName: "test", taskFuzzer: "AFL", taskTimeStart: 3, taskStatus: 2}
]

export default {
    
    'GET /api/tasklist': list,

    'POST /api/uploadtask': (req, res)=>{
        const item = {task_id: length(list)+1, task_name: req.body.TaskName, task_type: req.body.Fuzzer, start_time: 0, task_status: 2}
        list.unshift(item)
        res.send({ 
            status:201,
        })
        
    },
    'PUT /api/restarttask': (req, res) => {
        list.map((item, index) => {
            if (item.id === req.body.id){
                list[index].status = 2
            }
        })
        res.send({ 
            status:201,
            message: req.body,
        })
    },
    'PUT /api/stoptask': (req, res) => {
        list.map((item, index) => {
            if (item.id === req.body.id) list[index].status = 0
        })
        res.send({ 
            status:201,
            message: req.body,
        })
    }

}