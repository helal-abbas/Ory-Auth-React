import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";


const Registration = () => {
    const navigate = useNavigate()
    
    const [flowId, setFlowId] = useState(null);
    const [csrf_token, setcsrf_token] = useState(null);
    const getFlow = async () => {
        const res = await axios.get(
            "http://192.168.0.2:4433/self-service/registration/browser",
            {
                withCredentials: true,
            }
        );
        setFlowId(res.data.id);
        navigate({ search: '?flow=' + res.data.id });
        setcsrf_token(res.data.ui.nodes[0].attributes.value);
    };

    useEffect(() => {
        getFlow();
    }, []);
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = async (values: any) => {
        console.log("all values information....",values);
        try {
            console.log(values);

            const obj = {
                "traits.email": values.email,
                password: values.password,
                "traits.name.first": values.firstName,
                "traits.name.last": values.lastName,
                method: "password",
                csrf_token: csrf_token,
            };
            const res = await axios.post(
                `http://192.168.0.2:4433/self-service/registration?flow=${flowId}`,
                obj,
                {
                    withCredentials: true,
                }
            );
            navigate(`/home/dashboard`);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="form-container">
                <h1>Sign Up</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="name">First Name</label>
                            {/* <Field type="text" id="name" name="name" /> */}
                            <Field type="text" id="firstName" name="firstName" />
                            <ErrorMessage
                                name="firstName"
                                component="div"
                                className="error-message"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Last Name</label>
                            <Field type="text" id="lastName" name="lastName" />
                            <ErrorMessage
                                name="lastName"
                                component="div"
                                className="error-message"
                            />
                        </div>
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
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                            />
                            <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="error-message"
                            />
                        </div>
                        <div className='button-group'>
                            <button type="submit">Sign Up</button>
                            <button onClick={() => navigate('/auth/login')}>Login</button>
                        </div>
                    </Form>
                </Formik>
                
            </div>
            
        </>
    )
}

export default Registration;
