import React, { useState } from "react";
import cn from "classnames";
import { Alert, DialogContentText } from "@mui/material";
import FormField from "../../FormField";
import styles from "./Forms.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import loginValidation from "utils/schemas/loginValidation";
import { xhrLoginUser } from "api/userApi";
import { LoginUserDto } from "interfaces/LoginUserDto";
import { useDispatch } from "react-redux";
import { setUserInfo } from "actions/authActions";
import { useLocalStorage } from "hooks";
import { UserResponse } from "types/UserResponse";

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { setStorageValue } = useLocalStorage<UserResponse | null>(
    "userInfo",
    null
  );
  const dispatch = useDispatch();
  const loginForm = useForm<LoginUserDto>({
    mode: "onSubmit",
    resolver: yupResolver(loginValidation),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = loginForm;

  const onSubmit = async (dto: LoginUserDto) => {
    console.log(dto);
    try {
      const user = await xhrLoginUser(dto);
      setStorageValue(user);
      dispatch(setUserInfo(user));
      setErrorMessage("");
    } catch (err: any) {
      console.warn(err);
      if (err.response) {
        setErrorMessage(err.response.data.message);
      }
    }
  };

  return (
    <>
      <DialogContentText classes={cn(styles.title)}></DialogContentText>
      <FormProvider {...loginForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField name="email" label="Почта" focused></FormField>
          <FormField name="password" label="Пароль"></FormField>
          {errorMessage && (
            <Alert sx={{ marginTop: "10px" }} severity="error">
              {errorMessage}
            </Alert>
          )}
          <div className={cn(styles.container)}>
            <button type="submit" className={cn(styles.button)}>
              Войти
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default LoginForm;
