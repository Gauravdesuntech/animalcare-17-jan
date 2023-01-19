import Configs from "../config/Configs";
import Base64 from "../config/Base64";
import { getRequestUrl, getPostRequestOptions } from "../utils/Util";

const getFormData = (obj) => {
  let formdata = new FormData();
  for (let key in obj) {
    formdata.append(key, obj[key]);
  }
  return formdata;
};

const getHeaderToken = (token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

export const getDepartmentReport = async (date,token) => {
  let url = Configs.ATTENDENCE_BASE + "get_department_report?date=" + date;
  console.log(url);
  let requestOptions = {
    method: "GET",
    headers: getHeaderToken(token),
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAttendanceTiming = async (date,user_id,token) => {
  let url = Configs.ATTENDENCE_BASE + "get_attendance_time?date=" + date + "&user_id="+user_id;
  console.log(url);
  let requestOptions = {
    method: "GET",
    headers: getHeaderToken(token),
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAttendanceDetails = async (date,user_id,token) => {
  let url = Configs.ATTENDENCE_BASE + "get_attendance_details?date=" + date + "&user_id="+user_id;
  console.log(url);
  let requestOptions = {
    method: "GET",
    headers: getHeaderToken(token),
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAttendanceDateWise = async (date, token) => {
  let url = Configs.ATTENDENCE_BASE + "get_attendance_datewise?date=" + date; 
  console.log(url);
  let requestOptions = {
    method: "GET",
    headers: getHeaderToken(token),
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAttendanceMonthWise = async (month,user_id,token) => {
  let url = Configs.ATTENDENCE_BASE + "month_list?user_id=" + user_id + "&month="+month;
  console.log(url);
  let requestOptions = {
    method: "GET",
    headers: getHeaderToken(token),
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getWorkTypes = async (token) => {
  let url = Configs.ATTENDENCE_BASE + "work_types";
  console.log(url);
  let requestOptions = {
    method: "GET",
    headers: getHeaderToken(token),
  };
  let response = await fetch(url, requestOptions);
  // console.log(await response.text());
  return await response.json();
};


export const addAttendance = async (requestObj,token,files) => {
  let url = Configs.ATTENDENCE_BASE + "create/";

  let formdata = new FormData();
  formdata.append("user_id", requestObj.user_id);
  formdata.append("site_location",  requestObj.site_location);
  formdata.append("attandence_type_id",  requestObj.attandence_type_id);
  formdata.append("punch_date",  requestObj.punch_date);
  formdata.append("punch_time",  requestObj.punch_time);
  formdata.append("comments",  requestObj.comments);
  
  let requestOptions = {
    method: "POST",
    headers: getHeaderToken(token),
    body: formdata,
    redirect: 'follow'
  };

  if (files.length > 0) {
    files.forEach((item, i ) => {
      requestOptions.body.append("media_files[]", {
        uri: item.uri,
        type: item.type,
        name: item.name,
      });
    });
  }
  console.log( {url , requestOptions} );
  let response = await fetch(url, requestOptions);
  // console.log(await response.text());
  return await response.json();
};

