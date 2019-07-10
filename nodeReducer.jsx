const UPDATE_NODE = 'UPDATE_NODE';
const ADD_NODE = 'ADD_NODE';
const REMOVE_NODE = 'REMOVE_NODE';

const sampleOfSchema = {
    byId: [16, 24, 34],
    byHash: {
        16: {id: 16, payload: {title: 'item 1'}},
        24: {id: 24, payload: {title: 'item 2'}},
        34: {id: 34, payload: {title: 'item 3'}}
    }
};

export const nodeReducer = (state = sampleOfSchema, action = {}) => {
    switch (action.type) {
    case ADD_NODE: {
        return {
            byId: [...state.byId, action.id],
            byHash: {
                ...state.byHash,
                [action.id]: action.payload
            }
        };
    }
    case UPDATE_NODE: {
        // const {
        //     [action.id]: updatedValue,
        //     ...newStateByHash
        // } = state.byHash;
        return {
            byId: [...state.byId],
            byHash: {
                ...state.byHash,
                [action.id]: action.payload
            }
        };
    }
    case REMOVE_NODE: {
        const {
            [action.id]: deletedValue,
            ...newStateByHash2
        } = state.byHash;
        return {
            byId: state.byId.filter(item => item !== action.id),
            byHash: newStateByHash2
        };
    }
    default:
        return state;
    }
};
