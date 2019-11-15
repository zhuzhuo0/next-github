import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import axios from 'axios'

const userInitialState = {};

const LOGOUT = "LOGOUT";

const userReducer = (state = userInitialState, action) => {
    switch (action.type) {
        case LOGOUT:
            return {}
        default:
            return state;
    }
};

export const logout = () => {
    return (dispatch) => {
        axios.post('/logout').then(res => {
            if (res.status === 200) {
                dispatch({
                    type: LOGOUT
                })
            }
        }).catch(err => {
            console.error(error)
        })
    }
}

const allReducer = combineReducers({
    user: userReducer
});

export default state => {
    const store = createStore(
        allReducer,
        Object.assign({}, { user: userInitialState }, state),
        composeWithDevTools(applyMiddleware(ReduxThunk))
    );
    return store
};
