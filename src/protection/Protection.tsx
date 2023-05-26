import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
function Protected() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [isSignedIn, setIsSignedIn] = useState<null | boolean>(null);
    const callWhoAmI = async () => {
        try {
            setLoading(true)
            const res = await axios.get("http://192.168.0.2:4433/sessions/whoami", {
                withCredentials: true,
            }).then((res) => {
                return res.data;
            });
            console.log("res is", res);
            setIsSignedIn(true);
            // navigate('home/dashboard')
            sessionStorage.setItem('identity',res.identity?.traits?.email)
            const verify = res.identity.verifiable_addresses[0].verified;
            console.log(verify)
            setLoading(false)
            if(verify) return navigate('/home/dashboard');
            if(!verify) return navigate('/auth/verification')
            
        } catch (error: any) {
            navigate(location.pathname ?? '/login');
            console.error(error.response.status)
            if (error.response.status !== 200) {
                setIsSignedIn(false);
                setLoading(false)
            }
        }
    };
    useEffect(() => {
        callWhoAmI();
    }, []);

    if (loading) return <h1>loading</h1>
    // if (isSignedIn == true) {
    //     console.log("called dashoboard");
    //     return <Navigate to="/home/dashboard" replace />;
    // }
    // if (isSignedIn == false) {
    //     console.log("called");
    //     return <Navigate to="/login" replace />;
    // }

    return <Outlet />;
}

export default Protected;