import React from 'react';
import {useColorScheme} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Skeleton = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SkeletonPlaceholder
      borderRadius={5}
      backgroundColor={isDarkMode ? '#424242' : '#eee'}>
      <SkeletonPlaceholder.Item
        marginTop={hp(2)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item
        marginTop={hp(2)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item
        marginTop={hp(2)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item
        marginTop={hp(2)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
        <SkeletonPlaceholder.Item height={wp(50)} width={wp(43)} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default Skeleton;
