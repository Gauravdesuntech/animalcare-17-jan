import React, { Component } from "react";
import AppContext from "../context/AppContext";
import * as FileSystem from "expo-file-system";
import { delete_table_data, get_data } from "./Utils";
import OverlayLoader from "../component/OverlayLoader";
import { manageOfflineData } from "../services/OfflineDataServices";

export default class Sync extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      section: 0,
      enclosure: 0,
      animal: 0,
      incident_type: 0,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    this.getAllData();
  }

  getAllData = () => {
    Promise.all([
      get_data("incident_reporting"),
      get_data("medical_record"),
      get_data("observations"),
    ])
      .then((data) => {
        if (data[0].length > 0 || data[1].length > 0 || data[2].length > 0) {
          let obj = {
            incident: JSON.stringify(data[0]),
            medical: JSON.stringify(data[1]),
            observations: JSON.stringify(data[2]),
          };
          manageOfflineData(obj)
            .then((res) => {
              this.setState({
                isLoading: false,
              });
              if (res.incident + res.medical + res.observation == res.journal) {
                if (
                  res.incident > 0 ||
                  res.medical > 0 ||
                  res.observation > 0
                ) {
                  alert("Sync Done!!");
                  delete_table_data("incident_reporting");
                  delete_table_data("medical_record");
                  delete_table_data("observations");
                  this.deleteAllcachedImages();
                  this.props.navigation.navigate("Home");
                } else {
                  alert("Some data not synced!!");
                  this.props.navigation.navigate("Home");
                }
              } else {
                alert("Journal not Created!!");
                this.props.navigation.navigate("Home");
              }
            })
            .catch((error) => {
              console.log(error);
              alert("Something went wrong!!");
              this.setState(
                {
                  isLoading: false,
                },
                () => this.props.navigation.navigate("Home")
              );
            });
        } else {
          alert("No offline data available!!");
          this.props.navigation.navigate("Home");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong!!");
        this.setState(
          {
            isLoading: false,
          },
          () => this.props.navigation.navigate("Home")
        );
      });
  };
  deleteAllcachedImages = async () => {
    let cacheImagesPath = FileSystem.cacheDirectory + "ImagePicker";
    await FileSystem.deleteAsync(cacheImagesPath);
  };

  render() {
    return <OverlayLoader visible={this.state.isLoading} />;
  }
}
