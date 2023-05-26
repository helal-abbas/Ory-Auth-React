//@ts-nocheck
import { createContext, useContext, useReducer } from "react";

const Context = createContext<any>({});

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'REQUEST_ID':
            return {
              ...state,
              flowId: action.flowId,
              csrf_token: action.csrf_token
            }
        default:
            return state
    }
}

export default function ContextProvider({children}){
    const [initiateLogin, setInitiateLogin] = useReducer(reducer, {
        flowId: '',
        csrf_token: '',
    });


    return(
        <Context.Provider value={{initiateLogin, setInitiateLogin}}>
            {children}
        </Context.Provider>
    )
}


export const useContextProvider=() => {
    return useContext(Context);
}