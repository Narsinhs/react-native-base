import * as React from 'react';
import {  Animated } from 'react-native';
import {
    useFocusEffect,
  } from '@react-navigation/native';
 const FadeInView = (ChildernComponent) => {
  
    return (props) => {
        const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  
        useFocusEffect(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
          return () => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }).start();
          };
        });
    return (
      <Animated.View // Special animatable View
        style={{
          flex: 1,
          opacity: fadeAnim, // Bind opacity to animated value
        }}>
      <ChildernComponent {...props}/>
      </Animated.View>
    );
  };
}
export default FadeInView