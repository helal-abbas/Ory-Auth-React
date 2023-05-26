import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import "./VerificationPage.css";
import { initiateRequest } from "../kratos/kratos";
import { useNavigate } from "react-router-dom";
import { useContextProvider } from "../context/context";
import axios from "axios";
import { completeRecovery } from "../Environment";

interface RecoveryFormValues {
  code: string | null;
}

const initialValues: RecoveryFormValues = {
  code: '',
};

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .required("Verification code is required")
    .matches(/^\d{6}$/, "Verification code must be a 6-digit number"),
});

interface RecoveryPageProps {
  onSubmit: (values: RecoveryFormValues) => void;
}

const RecoveryCode = () => {
  const { initiateLogin,setInitiateLogin} = useContextProvider();
  const navigate = useNavigate();
  const onSubmit = async() => {
    const body = {
      email: sessionStorage.getItem('identity'),
      csrf_token: initiateLogin.csrf_token,
      method: 'code',
      code : ''
    }

    console.log(body);

    const response = await axios.post(`${completeRecovery}${initiateLogin.flowId}`,
      body,
      {
        withCredentials: true
      }
    ).then((res) => {
      return res.data;
    }).catch((error) => {
      console.error(error);
    })
  }

  useEffect(() => {
    const request = initiateRequest({ type: 'recovery' }) as Promise<any>;
    request
            .then((response) => {
                console.log(response)
                
                setInitiateLogin({
                  flowId: response.id,
                  csrf_token: response.ui.nodes[0].attributes.value,
                  type: "REQUEST_ID"
              })
               
                navigate({ search: '?flow=' + response.id });
            })
  },[])




  return (
    <div className="verification-page">
      <h1>Verification</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="code">Recovery code</label>
              <Field
                type="text"
                id="code"
                name="code"
                className={`form-control ${touched.code && errors.code ? "is-invalid" : ""
                  }`}
                
              />
              <ErrorMessage
                name="code"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Verify
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RecoveryCode;
