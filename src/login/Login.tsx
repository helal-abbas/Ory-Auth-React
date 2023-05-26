import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { initiateRequest } from '../kratos/kratos';
import { useContextProvider } from '../context/context';

function Login() {
    const { initiateLogin,setInitiateLogin} = useContextProvider();
    const navigate = useNavigate()


    const initialValues = {
        email: "",
        password: "",
    };
    
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleSubmit = async (values: any) => {

        try {
            const body = {
                password_identifier: values.email,
                password: values.password,
                method: "password",
                csrf_token: initiateLogin.csrf_token,
            };
            await axios.post(
                `http://192.168.0.2:4433/self-service/login?flow=${initiateLogin.flowId}`,
                body,
                {
                    withCredentials: true,
                }
            );

            navigate(`/home/dashboard`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const request = initiateRequest({ type: 'login' }) as Promise<any>;
        request
            .then((response) => {
                console.log(response.id)
                setInitiateLogin({
                    flowId: response.id,
                    csrf_token: response.ui.nodes[0].attributes.value,
                    type: "REQUEST_ID"
                })
                navigate({ search: '?flow=' + response.id });
            })
    }, []);



    return (
        <>
            <div className="form-container">
                <h1>Login</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field type="email" id="email" name="email" />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="error-message"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field type="password" id="password" name="password" />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="error-message"
                            />
                        </div>
                        <button type="submit">Login</button>
                    </Form>
                </Formik>
                <button onClick={() => navigate('/auth/registration')}>Sing Up</button>
                <button onClick={() => navigate('/auth/recovery')}>Forgot Password</button>
            </div>

        </>
    )
}

export default Login;
