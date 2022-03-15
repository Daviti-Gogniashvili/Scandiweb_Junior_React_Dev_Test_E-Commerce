import { combineReducers } from 'redux';

const categoryDataReducer = (state = [], action) => {
    if (action.type === true)
        return Object.assign({}, {
            data: action.payload.data,
            category: action.payload.category,
            path: action.payload.path
        });
    else
        return state;
}

const singleDataReducer = (state = [], action) => {
    if (action.type === "id")
        return Object.assign({}, {
            id: action.payload.id
        });
    else
        return state
}

const currencyReducer = (state = 0, action) => {
    if (action.type === "currency")
        return Object.assign({}, {
            curIndex: action.payload.curIndex,
            symbol: action.payload.symbol
        })
    else
        return state
}

let State = JSON.parse(sessionStorage.getItem("badge")) || 0;

const badgeReducer = (state = State, action) => {
    if (action.type === "plus")
        return State += 1;
    else if (State !== 0 && action.type === "minus")
        return State -= 1;
    else
        return state;
}

const refreshReducer = (state = 0, action) => {
    if (action.type === "refresh") return "refresh";
    else return state;
}


const rootReducer = combineReducers({
    categoryDataReducer,
    singleDataReducer,
    currencyReducer,
    badgeReducer,
    refreshReducer
});

export default rootReducer