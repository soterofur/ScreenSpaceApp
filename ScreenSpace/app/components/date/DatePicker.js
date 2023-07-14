// import React, { useState } from 'react';
// import { View, Button } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const DatePicker = () => {
//   const [date, setDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);

//   const handleDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShowPicker(false);
//     setDate(currentDate);
//     console.log(currentDate);
//   };

//   const showDateTimePicker = () => {
//     setShowPicker(true);
//   };

//   const hideDateTimePicker = () => {
//     setShowPicker(false);
//   };

//   const minDate = new Date();
//   const maxDate = new Date();
//   maxDate.setDate(minDate.getDate() + 30); // set max date to 30 days from today

//   return (
//     <View>
//       <Button title="Select Date" onPress={showDateTimePicker} />
//       {showPicker && (
//         <DateTimePicker
//           testID="datePicker"
//           value={date}
//           mode="date"
//           is24Hour={true}
//           display="default"
//           minimumDate={minDate}
//           maximumDate={maxDate}
//           onChange={handleDateChange}
//         />
//       )}
//     </View>
//   );
// };

// export default DatePicker;
