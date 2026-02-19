/* eslint-disable prettier/prettier */
import styled from 'styled-components/native';

export const OTPInputContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

export const TextInputHidden = styled.TextInput`
  position: absolute;
  opacity: 0;
  z-index: -999;
`;

export const SplitOTPBoxesContainer = styled.Pressable`
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
`;
export const SplitBoxes = styled.View`
  border-radius: 5px;
  min-width: 19%;
  min-height: 95%;
  elevation: 5;
  background-color: #fff;
  border-width: 0.3px;
  border-color: #999;
  bottom: -2px;
  justify-content: center;
  align-items: center;
`;

export const SplitBoxText = styled.Text`
  font-size: 15px;
  text-align: center;
  color: #000;
`;

export const SplitBoxesFocused = styled(SplitBoxes)`
  border-color: #f7f1ab;
  border-width: 2px;
`;
