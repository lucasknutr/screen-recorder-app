import React from 'react';
import { Button } from 'react-native';

interface Props {
  onPress: () => void;
  title: string;
}

const RecordingButton: React.FC<Props> = ({ onPress, title }) => (
  <Button onPress={onPress} title={title} />
);

export default RecordingButton;
