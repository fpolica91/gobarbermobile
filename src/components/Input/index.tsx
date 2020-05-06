/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import {TextInputProps} from 'react-native';
import {Container, TextInput, Icon} from './styles';
import {useField} from '@unform/core';

/**
 * @useImperativeHandle is used to pass props from child to parent
 * @forwardRef wrap export in this when using
 */

export interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueRef {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  {name, icon, ...rest},
  ref,
) => {
  const inputElementRef = useRef<any>(null);
  const {registerField, defaultValue = '', fieldName, error} = useField(name);
  const inputValueRef = useRef<InputValueRef>({value: defaultValue});
  const [isFocused, setFocus] = useState(false);
  const [isFilled, setFilled] = useState(false);
  /**
   * @inputValueRef ref because there is no HMTL attributes in move
   * @inputElementRef allows to see changes as the user types
   */
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  const handleFocus = useCallback(() => {
    setFocus(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocus(false);
    setFilled(!!inputValueRef.current.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value: string) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({text: value});
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isErrorred={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        keyboardAppearance="dark"
        {...rest}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={(value) => (inputValueRef.current.value = value)}
        placeholderTextColor="#666360"
      />
    </Container>
  );
};

export default forwardRef(Input);
