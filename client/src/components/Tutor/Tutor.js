import 'antd/dist/antd.min.css';
import "./Tutor.css";

import axios from "axios";
import moment from 'moment';


import { Button, DatePicker, Space, TimePicker, Typography } from 'antd';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SAVE_AVAILABILITY } from '../../apis/Availability';

const { Title } = Typography;

const Tutor = (props) => {
  const requestData = { id: '', date: '', startTime: '', endTime: '' }

  const [requestError, setRequestError] = React.useState(false);
  const [submitProcess, setSubmitProcess] = React.useState(false);

  const { auth, setAuth } = props;

  useEffect(() => {
    setAuth({
      ...auth, profileType: 'tutor'
    })
  }, [])

  const navigate = useNavigate();

  const onChangeDate = (date, dateString) => {
    console.log('Selected date:', dateString);
    requestData.date = dateString;
  };

  const onChangeTime = (time, timeString) => {
    console.log('Selected times:', timeString);
    requestData.startTime = timeString[0]
    requestData.endTime = timeString[1]
  };

  const onSubmitHandle = (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    console.log(requestData);
    requestData.id = localStorage.getItem('username');
    if (requestData.date && requestData.id && requestData.startTime && requestData.endTime) {

      var data = JSON.stringify(requestData);

      var config = {
        method: 'post',
        url: SAVE_AVAILABILITY,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*',
          "Access-Control-Allow-Credentials":"true",
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log('success')
          console.log(JSON.stringify(response.data));
          navigate('availability')
        })
        .catch(function (error) {
          console.log('error')
          console.log(error);
        }).finally(function () {
          console.log('finally')
          setSubmitProcess(false);
        })

      setSubmitProcess(true)
      setRequestError(false)
    } else {
      setRequestError(true)
    }
  }

  return (
    <>
      <form>
        <section style={{ textAlign: 'center' }}>
          <Title level={2}>Enter your availability</Title>
          <section>
            <Space direction="vertical" size={12}>
              <DatePicker disabledDate={(current) => {
                return moment().add(-1, 'days') >= current ||
                  moment().add(1, 'month') <= current;
              }} format={'DD-MM-YYYY'} onChange={onChangeDate} />
            </Space>
            <TimePicker.RangePicker format={'HH:mm'} onChange={onChangeTime} />
          </section>
          <section style={{ marginTop: '2.5%' }}>
            <Button type='primary' htmlType='button' onClick={onSubmitHandle} loading={submitProcess}> Submit </Button>
            <Button style={{ marginLeft: '2.5%' }} type='primary' onClick={() => navigate('availability')}> See All Availabilities </Button>
          </section>
        </section>
      </form>

    </>
  );

}

export default Tutor;