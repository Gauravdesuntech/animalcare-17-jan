//Util
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import moment from "moment";

// const db = SQLite.openDatabase("animalecare_database.db");
const db = SQLite.openDatabase("zoo_feeding_DB.db");
const date_format = "YYYY-MM-DD HH:mm:ss";

export const insert_data = (tbl, values) => {
  let sql_query = "INSERT INTO `" + tbl + "` (";
  sql_query += getValues(values);
  // console.log("sql_query>>>>>>>>>>>>>>>", sql_query);
  db.transaction((tx) => {
    tx.executeSql(sql_query);
  });
  getData(tbl);
  // share();
};

export const delete_table_data = (tbl) => {
  let sql_query = "DELETE FROM  `" + tbl + "`";
  // console.log("sql_query>>>>>>>>>>>>>>>", sql_query);
  db.transaction((tx) => {
    tx.executeSql(sql_query);
  });
};

export const get_all_table_data = (purpose) => {
  let sql_query =
    "SELECT * from `all_data_tbl` where purpose = '" + purpose + "'";
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        let result;
        tx.executeSql(
          sql_query,
          [],
          (_, { rows: { _array } }) => {
            resolve(JSON.parse(_array[0].data));
          },
          function (error) {
            reject(false);
            throw new Error("Error: " + error);
          }
        );
      },
      function (error) {
        reject(undefined);
        throw new Error("error: " + error.message);
      }
    );
  });
};

export const get_data = (tbl, key, query) => {
  let sql_query = "SELECT * from `" + tbl + "`";
  if (typeof key != "undefined") {
    sql_query += " where " + key + " = '" + query + "'";
  }
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        let result;
        tx.executeSql(
          sql_query,
          [],
          (_, { rows: { _array } }) => {
            resolve(_array);
          },
          function (error) {
            reject(false);
            throw new Error("Error: " + error);
          }
        );
      },
      function (error) {
        reject(undefined);
        throw new Error("error: " + error.message);
      }
    );
  });
};

export const insert_bulk_data = (tbl, values) => {
  let sql_query = "INSERT INTO `" + tbl + "` (";
  sql_query += getBulkValues(values);
  // console.log("sql_query>>>>>>>>>>>>>>>",sql_query);
  // db.transaction(tx => {
  //     tx.executeSql(sql_query);
  //   });
  // getData(tbl);
  // share();
};

export const update_data = (tbl, values, query) => {
  let sql_query =
    "UPDATE `" +
    tbl +
    "` SET data = '" +
    values +
    "' , created_on = '" +
    moment(new Date()).format(date_format) +
    "' WHERE purpose = '" +
    query +
    "'";
  db.transaction((tx) => {
    tx.executeSql(sql_query);
  });
  getData(tbl);
  // share();
};

function getValues(values) {
  let arr = [];
  let arr2 = [];
  Object.entries(values).forEach(([key, val]) => {
    arr.push("`" + key + "`");
    arr2.push("'" + val + "'");
  });
  return arr.toString() + ") VALUES(" + arr2.toString() + ")";
}

function getBulkValues(values) {
  let arr = [];
  let arr2 = [];
  let arr3 = [];
  values.forEach((element) => {
    Object.entries(element).forEach(([key, val]) => {
      alert("Here");
      // arr.push("`"+key+"`")
      // arr2.push("'"+val+"'")
      console.log("Value>>>>>>>>>>>", key);
      return;
      // arr3.push("("+arr2+")")
    });
    // arr3.push("("+arr2+")");
    // console.log("arr3.push>>>>>>>>",arr3.toString());
  });
  // arr3.push(arr2);
  // console.log("arr3.push>>>>>>>>",arr2);
  // return arr[0].toString()+") VALUES"+arr3.toString();
}

const share = async () => {
  console.log(FileSystem.documentDirectory + "SQLite/zoo_feeding_DB.db");
  await Sharing.shareAsync(
    FileSystem.documentDirectory + "SQLite/zoo_feeding_DB.db",
    { dialogTitle: "share or copy your DB via" }
  ).catch((error) => {
    console.log(error);
  });
};

const getData = (table) => {
  db.transaction((tx) => {
    tx.executeSql("select * from " + table, [], (_, { rows }) =>
      console.log(table + " Length?>>>>>>>>>>>>>>>>>", rows._array.length)
    );
  }, null);
};
