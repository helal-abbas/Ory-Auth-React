import { Configuration, IdentityApi,FrontendApi  } from '@ory/kratos-client';
import { baseUrl } from '../Environment';
import { useNavigate } from 'react-router-dom';

const kratos = new FrontendApi({ basePath: 'http://192.168.0.2:4433', 
    baseOptions: {
        withCredentials: true,
    }
  } as Configuration)

export const initiateRequest = ({ type } : { type: 'login' | 'registration' | 'verify' | 'settings' | 'recovery' }) => {
    const endPoints ={
        login: `${baseUrl}/self-service/login/browser`,
        registration: `${baseUrl}/self-service/registration/browser`,
        verify: `${baseUrl}/self-service/verification/browser`,
        settings: `${baseUrl}/self-service/settings/browser`,
    }

    return new Promise((resolve, reject) => {
        const params = new URLSearchParams(window.location.search);
        let authRequest:Promise<any> | undefined;

        if(type === 'login') authRequest =  kratos.createBrowserLoginFlow();
        if(type === 'registration') authRequest = kratos.createBrowserRegistrationFlow();
        if(type === 'recovery')  authRequest = kratos.createBrowserRecoveryFlow();
        if(type === 'verify') authRequest = kratos.createBrowserVerificationFlow();
        if(type === 'settings') authRequest = kratos.createBrowserSettingsFlow();
        if(!authRequest) return reject();
        authRequest.then(({data,status}) => {
            if(status === 200) {
               resolve(data);
        }})
    })
}