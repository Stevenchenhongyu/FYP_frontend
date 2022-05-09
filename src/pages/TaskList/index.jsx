import React, {useEffect, useState} from 'react';
import {Link} from 'umi';
import {PageContainer} from '@ant-design/pro-layout';
import { Button, Modal, Alert, message, Form, Input, Checkbox} from 'antd';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import {PlusOutlined} from "@ant-design/icons";
import {getAllTasks, uploadTask, restartTask, stopTask, downLoad} from "@/services/TaskList"
import ProForm,{
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormRadio,
    ProFormUploadButton,
    ProFormDigit,
    ProFormTextArea,
  } from '@ant-design/pro-form';


const Index = (props) => {

    // task status information 0: success; 1: error; 2: running;
    const status = [
        <Alert message="Success" type="success" showIcon />,
        <Alert message="Error" type="error" showIcon />,
        <Alert message="Running" type="info" showIcon/>,
    ]

    //functions for actions in table
    const changeStatus = async (id, key) => {
        if (key === 1){
            const res = await restartTask({id:id})
            if (res.status===201){
                message.success('restart succesfully');
                const resData = await getAllTasks();
                setData(resData);
            } else{
                message.error('restart failed');
            } 
        }
        if (key === 2){
            const res = await stopTask({id:id})
            if (res.status===201){
                message.success('stop succesfully');
                const resData = await getAllTasks();
                setData(resData);
            } else{
                message.error('stop failed');
            }
        } 
    } 
    // define the col name of tables
    const columns = [
        {
            title: "Task Name",
            dataIndex: "taskName"
        },
        {
            title: "Task Type",
            dataIndex: "taskFuzzer"
        },
        {
            title: "Starting Time",
            dataIndex: "taskTimeStart"
        },
        {
            title: "Task Status",
            dataIndex: "taskStatus",
            render: (_, record) => {
                if (record.taskStatus==='success'){
                    return status[0];
                }  
                if (record.taskStatus==='stop'){
                    return status[1];
                }
                if (record.taskStatus==='running'){
                    return status[2];
                }
            }
        },
        {
            title: "Actions",
            render: (_, record) => {
                let editOperation = []
                editOperation.push(
                    [
                        <Link to={`/TaskList/TaskDetails/${record.taskName}&${record.taskID}`}>Details   </Link>,  
                    ]
                )
                editOperation.push(
                    [
                        <a onClick={()=> downLoad(record.taskID)}>Download   </a>,  
                    ]
                )
                if (record.taskStatus==='stop') {
                    editOperation.push(
                        [
                            <a onClick={()=> changeStatus(record.taskID,1)} key={1} >Restart   </a>,  
                        ]
                    )  
                }
                if (record.taskStatus==='running') {
                    editOperation.push(
                        [
                            <a onClick={()=> changeStatus(record.taskID,2)} key={2} >Stop   </a>,  
                        ]
                    )  
                }
                return editOperation
            }
        },
    ]

    // present list
    let [data, setData] = useState([]);
    useEffect(async ()=> {
        const resData = await getAllTasks();
        //setData(resData.data.fields);
        var list=[];
        for(var i in resData.data){
            resData.data[i].fields.taskID=resData.data[i].pk
            list.push(resData.data[i].fields)
        }
        setData(list)

    }, []);

    // set "Create New Task" button attributes
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalText, setModalText] = React.useState('Content of the modal');

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    // set upload form attributes
    const onFinish = async (values) => {
        const res = await uploadTask(values)
        console.log('Success:', values);
        if (res.status===201){
            message.success('upload succesfully');
            const resData = await getAllTasks();
            setData(resData);
        } else{
            message.error('upload failed');
        }
        
      };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('upload failed');
      };


    return (
        <PageContainer>
            <ProTable 
            columns={columns} 
            rowKey="start_time" 
            pagination={{showQuickJumper: true,}} 
            dataSource={data}
            search={false} 
            dateFormatter="string" 
            headerTitle="All Tasks" 
            toolBarRender={() => [
            <>
            <Button type="primary" onClick={showModal} >
            <PlusOutlined />
            Create New Task
            </Button>
            <Modal
                title="Title"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
            >
                <ProForm
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    encType="multipart/form-data"
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    >
                    <ProForm.Group>
                        <ProFormText
                            width="xl"
                            label="Task Name"
                            name="taskName"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your taskname!',
                            },
                            ]}
                        />
                    </ProForm.Group>
                    
                    <ProFormRadio.Group
                        label="Fuzzer"
                        name="taskFuzzer"
                        initialValue="AFL"
                        options={['AFL', 'AFLPlus', 'AFLPlussss']}
                    />

                    <ProFormRadio.Group
                        label="Parrallel Number"
                        name="taskParaNum"
                        initialValue="1"
                        options={['1', '2', '3']}
                    />

                    <ProFormUploadButton
                                extra="Make sure this file is instrumented by the fuzzer"
                                label="Fuzzing Target"
                                name="target"
                                title="upload"
                                listType="file"
                                fieldProps={{
                                    name: 'file',
                                  }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                    ]}
                                />

                    <ProFormUploadButton
                                extra="this is the initial seed to start fuzzing"
                                label="Fuzzing Seed"
                                name="seed"
                                title="upload"
                                listType="file"
                                rules={[
                                    {
                                        required: true,
                                    },
                                    ]}
                                />

                    </ProForm>

                    
            </Modal>
            </>]
            }/>
        </PageContainer>   
    )
};

export default Index;