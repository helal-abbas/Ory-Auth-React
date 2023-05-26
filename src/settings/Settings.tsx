import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Settings.css';
import { initiateRequest } from '../kratos/kratos';
import { useContextProvider } from '../context/context';
import axios from 'axios';
import { completeSetting } from '../Environment';
import { useLocation, useSearchParams } from 'react-router-dom';

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

interface SettingsProps {
  onResetPassword: (values: ResetPasswordValues) => void;
}

const Settings: React.FC = () => {
  const location = useLocation();
  const params: any= new URLSearchParams(location.search);
  // const [initiateSettingFlow,setInitiateSettingFlow] = useContextProvider();
    const [initiateSettingFlow,setInitiateSettingFlow] = useState({
      flowId: '',
      csrf_token: '',
      type: "REQUEST_ID"
    });
  const resetPasswordInitialValues: ResetPasswordValues = {
    password: '',
    confirmPassword: '',
  };

  console.log(initiateSettingFlow)
  const handleResetPasswordSubmit = async(values: ResetPasswordValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    
    setSubmitting(false);
    const body = {
      csrf_token: initiateSettingFlow.csrf_token,
      method: "password",
      password: values.password
    }
    const response = await axios.post(`${completeSetting}${initiateSettingFlow.flowId}`,
    body,{
      withCredentials: true
    })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error(error);
      })
    
  };

  const settingURLs = async(id: string) => {
    const response = await axios.get('http://192.168.0.2:4433/self-service/settings/flows?id='+id,{
      withCredentials: true
    })
      .then((res) => {
        
        return res.data;
      })
      .catch((error)=> {
        console.error(error);
      });

      response.ui.nodes.forEach((element: any) => {
        const value = element.attributes
        switch(value.name){
          case "csrf_token": 
          setInitiateSettingFlow({...initiateSettingFlow,flowId: id, csrf_token: value.value});
                      break;
        }
      });
  }

  useEffect(() => {
    // const request = initiateRequest({ type: 'settings' }) as Promise<any>;
    // request
    //         .then((response) => {
    //             console.log(response.id)
    //             setInitiateSettingFlow({
    //                 flowId: response.id,
    //                 csrf_token: response.ui.nodes[0].attributes.value,
    //                 type: "REQUEST_ID"
    //             });
               
    //             // navigate({ search: '?flow=' + response.id });
    //         })
    // 
    if(params.get('flow')){
      // setInitiateSettingFlow({...initiateSettingFlow, flowId: params.get('flow')});
      settingURLs(params.get('flow'));
      
    }
   

  },[])
  return (
    <div className="auth-forms-container">
      <div className="reset-password-form-container">
        <h2>Reset Password</h2>
        <p>Please enter a new password.</p>
        <Formik
          initialValues={resetPasswordInitialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleResetPasswordSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="reset-password-form">
              <div className="form-field">
                <label htmlFor="password">New Password</label>
                <Field type="password" name="password" placeholder="Enter your new password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <Field type="password" name="confirmPassword" placeholder="Confirm your new password" />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                Reset password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Settings;
