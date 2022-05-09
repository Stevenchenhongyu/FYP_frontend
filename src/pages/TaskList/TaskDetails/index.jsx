import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import { Descriptions, Badge, Image } from 'antd';
import { getPageQuery } from '@/utils/utils';
import { Modal } from 'antd';
import {getTaskDetails} from "@/services/TaskList"

import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import { List, Typography, Divider } from 'antd';

const taskDetails = (props) => {
  // console.log(this.props.params.taskID)
  var taskID=props.match.params.taskID;
  var taskName=props.match.params.taskName;
  const [runningTime, updateRunningTime] = React.useState('x');
  const [startingTime, updateStartingTime] = React.useState('x'); 
  const [taskStatus, updateTaskStatus] = React.useState('x');
  const [crash, updateCrash] = React.useState(['x']);
  var taskDescription = "this is task description";
  // buy afl specific method
  var codeCoverage = "x";
  // check file number
  const [foundCrashes, updateFoundCrashes] = React.useState('x');
  // run afl-plot
  const [bugTrending, updateBugTrending] = React.useState("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");
  React.useEffect(function efffectFunction(){
    async function getDetails(){
      const resData = await getTaskDetails({taskID:taskID,taskName:taskName});
      updateBugTrending(resData.image) 
      updateRunningTime(Date.now() - resData.data[0].fields.taskTimeStart);
      updateStartingTime(resData.data[0].fields.taskTimeStart);
      updateTaskStatus(resData.data[0].fields.taskStatus);
      updateFoundCrashes(resData.foundCrashes)
      updateCrash(resData.crashes)

      console.log(resData.crashes);
    }
    getDetails();
  })

  return(
    <PageContainer>
      <Descriptions title="Task Details" layout="vertical" bordered>
        <Descriptions.Item label="Task Name" span={1}>{taskName}</Descriptions.Item>
        <Descriptions.Item label="Code Coverage" span={1}>{codeCoverage}</Descriptions.Item>
        <Descriptions.Item label="Found Crashes" span={1}>{foundCrashes}</Descriptions.Item>
        <Descriptions.Item label="Status" span={1}>{taskStatus}</Descriptions.Item>
        <Descriptions.Item label="Running Time" span={1}>{runningTime}</Descriptions.Item>
        <Descriptions.Item label="Starting Time" span={1}>{startingTime}</Descriptions.Item>
        <Descriptions.Item label="Task Description" span={3}>
          {taskDescription}
      </Descriptions.Item>
        <Descriptions.Item label="Bug Trendings" span={3}>
          <Image width={1050} height={400} src={`data:image/png;base64,${bugTrending}`}/>
      </Descriptions.Item>
      <Descriptions.Item label="Crash List" span={3}>
      <List
      size="small"
      header={<div>#######</div>}
      footer={<div>#######</div>}
      bordered
      dataSource={crash}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
      </Descriptions.Item>
      
        
      </Descriptions>,
    </PageContainer>
    
  )
};
export default taskDetails;
