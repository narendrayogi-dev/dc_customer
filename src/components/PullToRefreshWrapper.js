/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {RefreshControl} from 'react-native';

const PullToRefreshWrapper = ({handleRefresh, colors}) => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => handleRefresh(boolean => setRefreshing(boolean))}
      colors={colors}
    />
  );
};

export default PullToRefreshWrapper;
