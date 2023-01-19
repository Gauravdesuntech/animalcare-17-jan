//DB
import React, { Component } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("zoo_feeding_DB.db");

const create_feeding_images = `CREATE TABLE 'feeding_images' ('id' INTEGER,'imagebase64' BLOB, PRIMARY KEY('id' AUTOINCREMENT));`;

export default class SqLiteDatabase extends Component {
  componentDidMount() {
    this.querySql();
  }

  querySql = () => {
    db.transaction((tx) => {
      tx.executeSql(create_feeding_images);
      // tx.executeSql("DROP table 'feeding_images'");
    });
  };

  // getData = () => {
  //   db.transaction(
  //     (tx) => {
  //       tx.executeSql("select * from `feeding_images`", [], (_, { rows }) =>
  //         console.log("a", rows._array)
  //       );
  //       // tx.executeSql("select * from `medical_record`", [], (_, { rows }) =>
  //       //   console.log("b",rows._array.length)
  //       // );
  //     },
  //     null,
  //   );
  // }

  render() {
    return <></>;
  }
}
