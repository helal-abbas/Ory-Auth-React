import axios from "axios"
const baseUrl =  `http://192.168.0.2:4455/api`
const api = axios.create({
    baseURL: `http://192.168.0.2:4455/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});
export const getModel = async ()=> {
    return (await axios.get(`${baseUrl}/model`,{
        withCredentials: true
    })).data;
}

export const requestHandler = async(url: string,method='Get', data='') => {
    const response = await api.request({
        url,
        method,
        data
    });

    return response.data;
}