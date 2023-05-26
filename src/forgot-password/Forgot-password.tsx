import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Forgot-password.css';
import { initiateRequest } from '../kratos/kratos';
import { useNavigate } from 'react-router-dom';
import { useContextProvider } from '../context/context';
import axios from 'axios';
import { completeRecovery } from '../Environment';

interface ForgotPasswordValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
});

const ForgotPassword: React.FC = () => {
  const { initiateLogin,setInitiateLogin} = useContextProvider();
  const navigate = useNavigate();
  const initialValues: ForgotPasswordValues = {
    email: '',
  };

  const onSubmit = async (values: ForgotPasswordValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    console.log(values);
    setSubmitting(false);
    const body = {
      email: values.email,
      csrf_token: initiateLogin.csrf_token,
      "method": "code",
    }
    const response = await axios.post(`${completeRecovery}${initiateLogin.flowId}`, body,{
      withCredentials: true
    })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error(error);
      })

  };

  useEffect(() => {
    const request = initiateRequest({ type: 'recovery' }) as Promise<any>;
    request
            .then((response) => {
                console.log(response.id)
                setInitiateLogin({
                    flowId: response.id,
                    csrf_token: response.ui.nodes[0].attributes.value,
                    type: "REQUEST_ID"
                });
               
                navigate({ search: '?flow=' + response.id });
            })
  },[])

  return (
    <div>
      <h1>Forgot Password</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={ForgotPasswordSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="email">Email Address</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  );
};

export default ForgotPassword;
