import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../public/img/mopower_logo.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 50,
    marginBottom: 12,
  },
});

export default memo(Logo);
