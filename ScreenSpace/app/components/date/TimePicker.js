// import React, { useState } from 'react';
// import { View, TouchableOpacity,StyleSheet, Text, Platform } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const TimePicker = () => {
//   const [selectedTime, setSelectedTime] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);
//   const [prevSelectedTime, setPrevSelectedTime] = useState(null);

//   const handleTimeSelected = (event, time) => {
//     setShowPicker(false);
//     if (Platform.OS === 'android' && time !== undefined) {
//       const newTime = new Date();
//       console.log('Selected time:', time);
//       const minutes = time.getMinutes();
//       const horas = time.getHours()-3; // Restar 3 horas para ajustar a UTC-3
//       newTime.setMinutes(minutes);
//       newTime.setHours(horas); 
//       updatePrevSelectedTime();
//       setSelectedTime(newTime);
//       console.log('New time:', newTime);
//     }
//   };
  
  
//   const updatePrevSelectedTime = () => {
//     setPrevSelectedTime(selectedTime);
//   };

//   const showTimePicker = () => {
//     setShowPicker(true);
//   };

//   return (
//     <View>
//       <TouchableOpacity onPress={showTimePicker}>
//         <Text>Select a time:</Text>
//         <Text>{selectedTime.toLocaleTimeString()}</Text>
//       </TouchableOpacity>
//       {showPicker && (
//         // <View style={{ backgroundColor: 'blue', borderRadius: 25 }}>
//           <DateTimePicker
//             value={selectedTime}
//             mode="time"
//             is24Hour={true}
//             display="spinner"
//             minuteInterval={15}
//             onChange={handleTimeSelected}
//             accentColor="blue"
//           />
//         // </View>
//       )}
//       {prevSelectedTime && (
//         <Text>Previous time: {prevSelectedTime.toLocaleTimeString()}</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   androidPicker: {
//     backgroundColor: 'red',
//     borderRadius: 5,
//     width: 200,
//     height: 200,
//   },
// });

// export default TimePicker;
