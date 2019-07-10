const io = require('socket.io-client');

export const createSocketMiddleware = (store) => {
    const socket = io(global.location.origin, {
        path: '/sockets/node-coords'
    });

    socket.on('nodeCoords', (data) => {
        let msg;
        try {
            msg = JSON.parse(data);
        } catch (err) {
            // console.error(err);
            msg = data;
            console.log(data, msg);
        } finally {
            const currentState = store.getState().nodeReducer;
            console.log(currentState);
            const addNode = () => {
                store.dispatch({
                    type: 'ADD_NODE',
                    id: parseInt(msg.id, 10),
                    payload: msg
                });
            };
            if (currentState.byId) {
                console.log(currentState.byId.every(id => id !== msg.id));
                if (currentState.byId.every(id => id !== msg.id)) { // if the id doesnt exist
                    addNode(); // add it
                } else {
                    store.dispatch({
                        type: 'UPDATE_NODE',
                        id: msg.id,
                        payload: msg
                    });
                }
            } else {
                addNode();
            }
        }
    });

    return next => (action) => {
        // if (action.meta && action.meta === 'socket') {
        // switch (action.type) {
        // case 'CONNECT': {
        //     socket.connect();
        //     break;
        // }
        // case 'DISCONNECT': {
        //     socket.disconnect();
        //     break;
        // }
        // case 'SEND_MESSAGE': {
        //     socket.emit(action.payload);
        //     break;
        // }
        // default: break;
        // }
        // }
        next(action);
    };
};
