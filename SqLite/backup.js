import React, { Component } from 'react'
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';
import { Button } from 'react-native-elements/dist/buttons/Button';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LogBox, Text, TouchableOpacity } from 'react-native';
import AppContext from '../context/AppContext';
import { getAllocationSections, getFeedTaskTbl } from '../services/AllocationServices';
import { insert_bulk_data, insert_data, update_data } from './Utils';
import moment from 'moment';
import { getOfflineAnimals, getOfflineEnclosures, getOfflineSections } from '../services/OfflineDataServices';


const db = SQLite.openDatabase("animalecare_database.db");


const create_incident_reporting = "CREATE TABLE 'incident_reporting' ('id'INTEGER,'cid'INTEGER NOT NULL DEFAULT '1','ref'TEXT NOT NULL,'ref_id'TEXT DEFAULT NULL,'incident_type'TEXT DEFAULT NULL,'short_desc'TEXT DEFAULT NULL,'description'TEXT DEFAULT NULL,'learning'text,'priority'TEXT DEFAULT NULL,'reported_by'TEXT DEFAULT NULL,'solution'TEXT DEFAULT NULL,'to_be_closed_by'TEXT DEFAULT NULL,'to_be_closed_by_id'INTEGER DEFAULT NULL,'attachment'text,'status'TEXT DEFAULT 'P','created_by'TEXT DEFAULT NULL,'created_on'datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,'updated_on'datetime DEFAULT NULL,'is_deleted'INTEGER NOT NULL DEFAULT '0','hide_ref'TEXT DEFAULT NULL,'hide_ref_id'TEXT DEFAULT NULL,PRIMARY KEY('id' AUTOINCREMENT));";

const create_medical_record = "CREATE TABLE `medical_record` (`id` INTEGER NOT NULL,`cid` INTEGER NOT NULL,`date` date NOT NULL,`case_name` TEXT  DEFAULT NULL,`diagnosis_name` TEXT  NOT NULL,`diagnosis_name_id` INTEGER NOT NULL,`affected_parts_id` INTEGER NOT NULL,`affected_parts` TEXT  NOT NULL,`diagnosed_by_name` TEXT  NOT NULL,`diagnosed_by_id` INTEGER NOT NULL,`drug_id` TEXT  NOT NULL,`dosage` TEXT  NOT NULL,`next_treatment_date` date NOT NULL,`ref` TEXT  NOT NULL,`ref_id` INTEGER NOT NULL,`description` text  NOT NULL,`learning` text ,`priority` TEXT  NOT NULL,`reported_by` INTEGER NOT NULL,`route_id` INTEGER NOT NULL,`route_name` TEXT  NOT NULL,`image` TEXT  DEFAULT NULL,`doc` TEXT  DEFAULT NULL,`status` TEXT   NOT NULL DEFAULT 'P' ,`is_deleted` INTEGER NOT NULL DEFAULT '0' ,`created_by` TEXT  DEFAULT NULL ,`created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,`hide_ref` TEXT  DEFAULT NULL ,`hide_ref_id` TEXT  DEFAULT NULL ,PRIMARY KEY('id' AUTOINCREMENT));"

const create_all_date_tbl = "CREATE TABLE 'all_data_tbl' (	'id'	INTEGER NOT NULL,	'created_on'	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP UNIQUE,	'purpose'	TEXT, 'user_id'	TEXT,	'status'	TEXT NOT NULL DEFAULT '1',	'data'	TEXT,	'table_name'	TEXT,	PRIMARY KEY('id' AUTOINCREMENT));";

export default class SqLiteDatabase extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      section: 0,
      enclosure: 0,
      animal: 0,
    }
  }

  componentDidMount() {
    this.querySql();

  }

  querySql = () => {
    db.transaction(tx => {
      tx.executeSql(create_incident_reporting);
    });
    db.transaction(tx => {
      tx.executeSql(create_all_date_tbl); 
      // tx.executeSql("DROP table 'all_data_tbl'");
    });
    // db.transaction(tx => {
    //   tx.executeSql(create_medical_record);
    //   // tx.executeSql("DROP table 'medical_record'");
    // });
    db.transaction(tx => {
      tx.executeSql("select * from `all_data_tbl` where purpose = 'section'", [], (_, { rows: { _array } }) =>
        this.setState({
          section: _array.length
        })
      )
    });
    db.transaction(tx => {
      tx.executeSql("select * from `all_data_tbl` where purpose = 'enclosure'", [], (_, { rows: { _array } }) =>
        this.setState({
          enclosure: _array.length
        })
      )
    });
    db.transaction(tx => {
      tx.executeSql("select * from `all_data_tbl` where purpose = 'animal'", [], (_, { rows: { _array } }) =>
        this.setState({
          animal: _array.length
        })
      )
    });
    this.fetchData();
    // this.getData();
  }

  fetchData = () => {
    let cid = this.context.userDetails.cid;
    let user_id = this.context.userDetails.id;
    if (!this.context.isConnected) {
      this.getOfflineAnimals(cid, user_id);
    }
  }
  
  getOfflineAnimals = (cid, user_id) => {
    getOfflineAnimals(cid)
      .then((response) => {
        let animal_obj = {
          created_on: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          purpose: "animal",
          user_id: user_id,
          data: JSON.stringify(response),
          table_name: "animals"
        }
        if (this.state.animal >= 1) {
          update_data("all_data_tbl", animal_obj.data, animal_obj.purpose)
          console.log("update_data", animal_obj.purpose,this.state.animal);
        } else {
          insert_data("all_data_tbl", animal_obj)
          console.log("insert_data", animal_obj.purpose,this.state.animal);
        }
        // this.getOfflineSections(cid, user_id);
      })
      .catch((error) => console.log(error));
  }
  
  getOfflineSections = (cid, user_id) => {
    getOfflineSections(cid)
      .then((response) => {
        let section_obj = {
          created_on: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          purpose: "section",
          user_id: user_id,
          data: JSON.stringify(response),
          table_name: "section"
        }
        if (this.state.section >= 1) {
          update_data("all_data_tbl", section_obj.data, section_obj.purpose)
          console.log("update_data", section_obj.purpose,this.state.section);
        } else {
          insert_data("all_data_tbl", section_obj)
          console.log("insert_data", section_obj.purpose,this.state.section);
        }
        this.getOfflineEnclosures(cid, user_id);
      })
      .catch((error) => console.log(error));
  }
  getOfflineEnclosures = (cid, user_id) => {
    getOfflineEnclosures(cid)
      .then((response) => {
        let enclosure_obj = {
          created_on: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          purpose: "enclosure",
          user_id: user_id,
          data: JSON.stringify(response),
          table_name: "enclosure_id"
        }
        if (this.state.enclosure >= 1) {
          update_data("all_data_tbl", enclosure_obj.data, enclosure_obj.purpose)
          console.log("update_data", enclosure_obj.purpose,this.state.enclosure);
        } else {
          insert_data("all_data_tbl", enclosure_obj)
          console.log("insert_data", enclosure_obj.purpose,this.state.enclosure);
        }
      })
      .catch((error) => console.log(error));
  }


  getData = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("select * from `incident_reporting`", [], (_, { rows }) =>
          console.log("a", rows._array.length)
        );
        // tx.executeSql("select * from `medical_record`", [], (_, { rows }) =>
        //   console.log("b",rows._array.length)
        // );
      },
      null,
    );
  }

  share = async () => {
    console.log(FileSystem.documentDirectory + 'SQLite/db')
    await Sharing.shareAsync(
      FileSystem.documentDirectory + 'SQLite/animalecare_database.db',
      { dialogTitle: 'share or copy your DB via' }
    ).catch(error => {
      console.log(error);
    })
  }

  render() {
    return (
      <>
        {/* <TouchableOpacity style={{color:"red",width:60 , height: 500}} onPress={this.share}>
        <Text>Download</Text>
        </TouchableOpacity> */}
      </>
    )
  }
}




























// ----------------------------------------------------------------------------------------------------------------





import React, { Component } from 'react'
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';
import { Button } from 'react-native-elements/dist/buttons/Button';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LogBox, Text, TouchableOpacity } from 'react-native';
import AppContext from '../context/AppContext';
import { getAllocationSections, getFeedTaskTbl } from '../services/AllocationServices';
import { insert_bulk_data, insert_data, update_data } from './Utils';
import moment from 'moment';
import { getOfflineAnimals, getOfflineEnclosures, getOfflineSections } from '../services/OfflineDataServices';


const db = SQLite.openDatabase("animalecare_database.db");


const create_incident_reporting = "CREATE TABLE 'incident_reporting' ('id'INTEGER,'cid'INTEGER NOT NULL DEFAULT '1','ref'TEXT NOT NULL,'ref_id'TEXT DEFAULT NULL,'incident_type'TEXT DEFAULT NULL,'short_desc'TEXT DEFAULT NULL,'description'TEXT DEFAULT NULL,'learning'text,'priority'TEXT DEFAULT NULL,'reported_by'TEXT DEFAULT NULL,'solution'TEXT DEFAULT NULL,'to_be_closed_by'TEXT DEFAULT NULL,'to_be_closed_by_id'INTEGER DEFAULT NULL,'attachment'text,'status'TEXT DEFAULT 'P','created_by'TEXT DEFAULT NULL,'created_on'datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,'updated_on'datetime DEFAULT NULL,'is_deleted'INTEGER NOT NULL DEFAULT '0','hide_ref'TEXT DEFAULT NULL,'hide_ref_id'TEXT DEFAULT NULL,PRIMARY KEY('id' AUTOINCREMENT));";

const create_medical_record = "CREATE TABLE `medical_record` (`id` INTEGER NOT NULL,`cid` INTEGER NOT NULL,`date` date NOT NULL,`case_name` TEXT  DEFAULT NULL,`diagnosis_name` TEXT  NOT NULL,`diagnosis_name_id` INTEGER NOT NULL,`affected_parts_id` INTEGER NOT NULL,`affected_parts` TEXT  NOT NULL,`diagnosed_by_name` TEXT  NOT NULL,`diagnosed_by_id` INTEGER NOT NULL,`drug_id` TEXT  NOT NULL,`dosage` TEXT  NOT NULL,`next_treatment_date` date NOT NULL,`ref` TEXT  NOT NULL,`ref_id` INTEGER NOT NULL,`description` text  NOT NULL,`learning` text ,`priority` TEXT  NOT NULL,`reported_by` INTEGER NOT NULL,`route_id` INTEGER NOT NULL,`route_name` TEXT  NOT NULL,`image` TEXT  DEFAULT NULL,`doc` TEXT  DEFAULT NULL,`status` TEXT   NOT NULL DEFAULT 'P' ,`is_deleted` INTEGER NOT NULL DEFAULT '0' ,`created_by` TEXT  DEFAULT NULL ,`created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,`hide_ref` TEXT  DEFAULT NULL ,`hide_ref_id` TEXT  DEFAULT NULL ,PRIMARY KEY('id' AUTOINCREMENT));"

const create_all_date_tbl = "CREATE TABLE 'all_data_tbl' (	'id'	INTEGER NOT NULL,	'created_on'	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP UNIQUE,	'purpose'	TEXT, 'user_id'	TEXT,	'status'	TEXT NOT NULL DEFAULT '1',	'data'	TEXT,	'table_name'	TEXT,	PRIMARY KEY('id' AUTOINCREMENT));";

export default class SqLiteDatabase extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      section: "",
      enclosure: "",
      animal: "",
    }
  }

  componentDidMount() {
    this.querySql();
    
  }

  querySql=()=>{
    db.transaction(tx => {
      tx.executeSql(create_incident_reporting);
    });
    db.transaction(tx => {
      tx.executeSql(create_all_date_tbl);
      // tx.executeSql("DROP table 'all_data_tbl'");

    });
    // db.transaction(tx => {
    //   tx.executeSql(create_medical_record);
    //   // tx.executeSql("DROP table 'medical_record'");
    // });
    db.transaction(tx =>{
      tx.executeSql("select * from `all_data_tbl` where purpose = 'section'", [],(_, { rows: { _array } }) =>
        this.setState({
          section : _array.length
        })
      )
  });
    db.transaction(tx =>{
      tx.executeSql("select * from `all_data_tbl` where purpose = 'enclosure'", [],(_, { rows: { _array } }) =>
        this.setState({
          enclosure : _array.length
        })
      )
  });
    db.transaction(tx =>{
      tx.executeSql("select * from `all_data_tbl` where purpose = 'animal'", [],(_, { rows: { _array } }) =>
        this.setState({
          animal : _array.length
        })
      )
  });
    this.fetchData();
    this.getData();
  }

  fetchData=()=>{
    if(!this.context.isConnected){
    let cid = this.context.userDetails.cid;
    let user_id = this.context.userDetails.id;
    Promise.all([
      // getOfflineAnimals(cid),
      getOfflineSections(cid),
      getOfflineEnclosures(cid),
    ])
    .then((response) => {
      
      let obj={
        created_on : moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        user_id : user_id
      }
      for (let key in response) {
        obj.purpose = response[key].title;
        obj.table_name = response[key].title;
        obj.data = JSON.stringify(response[key].data);
        if(this.state[response[key].title] >= 1){
          update_data("all_data_tbl",obj.data,obj.purpose)
          console.log("update_data",obj.purpose);
        }else{
          insert_data("all_data_tbl",obj)
          console.log("insert_data",obj.purpose);
        }
      }
      this.share();




    //   console.log("Exist>>>>>>>",this.state.section,this.state.enclosure,this.state.animal);
    //   let section_obj={
    //     created_on : moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    //     purpose : "section",
    //     user_id : user_id,
    //     data : JSON.stringify(response[0]),
    //     table_name : "section"
    //   }
    //   if(this.state.section >= 1){
    //     console.log("Exist>>>>>111>>",this.state.section);
    //     update_data("all_data_tbl",section_obj.data,section_obj.purpose)
    //   }else{
    //     insert_data("all_data_tbl",section_obj)
    //   }

    //   let enclosure_obj={
    //     created_on : moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    //     purpose : "enclosure",
    //     user_id : user_id,
    //     data : JSON.stringify(response[1]),
    //     table_name : "enclosure_id"
    //   }
    //   if(this.state.enclosure >= 1){
    //     console.log("Exist>>>>222>>>",this.state.enclosure);
    //     update_data("all_data_tbl",enclosure_obj.data,enclosure_obj.purpose)
    //   }else{
    //     insert_data("all_data_tbl",enclosure_obj)
    //   }

    //   let animal_obj={
    //     created_on : moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    //     purpose : "animal",
    //     user_id : user_id,
    //     data : JSON.stringify(response[2]),
    //     table_name : "animals"
    //   }
    //   if(this.state.animal >= 1){
    //     console.log("Exist>>>3333>>>>",this.state.animal);
    //     update_data("all_data_tbl",animal_obj.data,animal_obj.purpose)
    //   }else{
    //     insert_data("all_data_tbl",animal_obj)
    //   }
    })
    .catch((error) => console.log(error));
    }
  }

  getData=()=>{
    console.log("called>>>>>>",)
    db.transaction(
      (tx) => {
        tx.executeSql("select * from `incident_reporting`", [], (_, { rows }) =>
          console.log("a",rows._array.length)
        );
        // tx.executeSql("select * from `medical_record`", [], (_, { rows }) =>
        //   console.log("b",rows._array.length)
        // );
      }, 
      null,
    );
  }

  share = async () => {
    console.log(FileSystem.documentDirectory + 'SQLite/db')
    await Sharing.shareAsync(
      FileSystem.documentDirectory + 'SQLite/animalecare_database.db',
      { dialogTitle: 'share or copy your DB via' }
    ).catch(error => {
      console.log(error);
    })
  }

  render() {
    return (
      <>
        {/* <TouchableOpacity style={{color:"red",width:60 , height: 500}} onPress={this.share}>
        <Text>Download</Text>
        </TouchableOpacity> */}
      </>
    )
  }
}

