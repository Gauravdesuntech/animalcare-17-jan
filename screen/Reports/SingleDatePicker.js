import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import moment from "moment";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors } from "../../config";
import styles from "./Style";

export const SingleDatePicker = (props) => {
  const [isDateTimePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    props.defaultDate ?? moment(new Date()).format("YYYY-MM-DD")
    // moment(new Date()).subtract(1, "days").format("YYYY-MM-DD")
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    props.getSelectedDate(selectedDate);
  }, [selectedDate]);

  const handleConfirm = (selectedDate) => {
    setSelectedDate(moment(selectedDate).format("YYYY-MM-DD"));
    hideDatePicker();
  };

  return (
    // <View style={styles.dateRangePickerWrapper}>
    <View style={{ borderBottomWidth: 1, borderColor: "#ddd", padding: 5 }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: Colors.textColor, alignSelf: "center" }}>
          Select Date
        </Text>
        <TouchableOpacity
          onPress={() => {
            showDatePicker("from");
          }}
          style={styles.dateRangePickerDateContainer}
        >
          <Text style={{ color: "green" }}>
            {moment(selectedDate).format("DD-MM-YYYY")}
          </Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        // display={Platform.OS == "ios" ? display : "default"}
        mode={"date"}
        isVisible={isDateTimePickerVisible}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};
