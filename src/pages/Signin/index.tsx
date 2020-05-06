/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useRef} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {Form, FormHandles} from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LogoImage from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';
import {useAuth} from '../../hooks/auth';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountText,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const {signIn, user} = useAuth();
  console.log(user);

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    console.log(data);
    formRef.current?.setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required('email is required'),
        password: Yup.string().required('password required'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
    }
  }, []);
  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flex: 1}}>
          <Container>
            <Image source={LogoImage} />
            <View>
              <Title>Login</Title>
            </View>
            <Form onSubmit={handleSignIn} ref={formRef}>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                secureTextEntry
                name="password"
                icon="lock"
                ref={passwordInputRef}
                placeholder="Password"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Sign In
              </Button>
            </Form>
            <ForgotPassword>
              <ForgotPasswordText>Forgot password</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton>
        <Icon name="log-in" size={20} color="#Ff9000" />
        <CreateAccountText onPress={() => navigation.navigate('Signup')}>
          Create Account
        </CreateAccountText>
      </CreateAccountButton>
    </>
  );
};

export default Signin;
