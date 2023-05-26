import React, { useState } from 'react'
import { logout, settingFlow, completeSetting } from '../Environment'
import axios from 'axios'
import { getModel, requestHandler } from '../rest-api/rest-api'

const Dashboard = () => {
   
    const logoutHandler = async () => {
        const response = await axios.get(`${logout}/browser`, {
            withCredentials: true
        }).then((res) => {
            return res.data;
        }).catch((error) => {
            console.log(error);
        });

        window.location.href = `${logout}?token=${response.logout_token}`

    }

    const handleModel = async () => {

        // const res= await getModel()
        //     .then((res) => res)
        //     .catch((error) => {
        //         console.error(error);
        //     });
            const response = requestHandler('/model');
            console.log("response====>",response);
    }

    const [ identity , setIdentity ] = useState('');
    const obj = {
        identity: identity
    }

    return (
        <>
            <div>Dashboard</div>
            <button onClick={() => logoutHandler()}>Logout</button>
            <button onClick={() => handleModel()}>Model</button>
            <div>
                <input type='text' value={identity} onChange={(e) => setIdentity(e.target.value)}></input>    
            </div>           
            <button onClick={() => {
                requestHandler('/identityId','POST', JSON.stringify(obj) )
            }}>Delete Identity</button>


        </>

    )
}

export default Dashboard;
