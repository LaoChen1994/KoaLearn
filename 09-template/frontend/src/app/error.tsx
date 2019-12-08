import React from 'react';
import _ from 'lodash';

interface Props {}

export const App: React.FC<Props> = () => {
  return <div>{_.join(['This', 'Page', 'is', 'not', 'Found!'], ' ')}</div>;
};
