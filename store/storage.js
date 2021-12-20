import {
    USER_AUTH
} from "./action";

const initialState = {
    userAuth: null
}

const basicStorage = (state = initialState, action) => {
    if(action.type === USER_AUTH){
        return{
            ...state,
            userAuth: action.userAuth
        }
    }
    return state;
}

export default basicStorage;