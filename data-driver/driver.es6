const username = require("os").userInfo().username;
if (username !== 'postgres') {
    throw new Error('please run this script as user postgres');
};


const promise = require('bluebird');
const pgp = require('pg-promise')({
    promiseLib: promise
});
const connectionString = 'postgres://localhost:5432/network_node_db';
const db = pgp(connectionString);

const nodeCoords = require('./nodeCoords.json');

let coordinateState; // initialize our local coordinate state to later hold the previous coordinate value


const populateTables = async () => {
    const cs = new pgp.helpers.ColumnSet(['latitude', 'longitude'], {table: 'nodes'});
    const {node1} = nodeCoords;
    const {node2} = nodeCoords;
    const values = [
        {latitude: node1.coords1[0], longitude: node1.coords1[1]},
        {latitude: node2.coords1[0], longitude: node2.coords1[1]},
        {latitude: '32.694288', longitude: '-117.102413'},
        {latitude: '32.653829', longitude: '-117.203865'},
        {latitude: '32.610459', longitude: '-117.089881'}
    ];
    const insertQuery = pgp.helpers.insert(values, cs);
    try {
        await db.none(insertQuery);
        console.log(`successfully populated tables with initial values`);
    }
    catch (error) {
        console.log(`error occured`);
    }
};


const checkTables = async () => { // first check to see if we have initial values in our database, if not, populate.
    try {
        const tableExists = await db.any('SELECT * FROM nodes');
        if (!tableExists || tableExists.length === 0) {
            populateTables();
        }
    }
    catch (e) {
        console.log(e);
    }
};
checkTables();


const changeCoords = (prevCoords = 'coords1') => {
    switch (prevCoords) {
    case 'coords1':
        return 'coords2';
    case 'coords2':
        return 'coords3';
    case 'coords3':
        return 'coords4';
    case 'coords4':
        return 'coords5';
    case 'coords5':
        return 'coords6';
    case 'coords6':
        return 'coords1';
    default:
        return 'coords1';
    }
}


const updateCoords = async ({lat, lon, id}) => {
    try {
        const updateQuery = 'update nodes set latitude=$1, longitude=$2 where id=$3';
        await db.any(updateQuery, [lat, lon, parseInt(id, 10)]);
    }
    catch (e) {
        console.log(e);
    }
};


const updateOnTrigger = (coordinateState, payload) => {
    const node = JSON.parse(payload);
    const nodeId = `node${node.id}`;
    const nodeToUdate = nodeCoords[nodeId];
    console.log(node.id);

    updateCoords({ // lat and lon reference the coords number that our coordinateState holds
        lat: nodeToUdate[coordinateState][0],
        lon: nodeToUdate[coordinateState][1],
        id: node.id
    });
};


db.connect({direct: true})
    .then((sco) => {
        console.log('Listening');
        sco.client.query('LISTEN "watchers"'); // We listen for the update which happens on channel 'watchers'
        sco.client.on('notification', (data) => {
            console.log(`update complete on ${data.payload}`);
            coordinateState = changeCoords(coordinateState); // Update the coordinate array we are on (see nodeCoords.json)
            console.log(coordinateState);
            setTimeout(() => updateOnTrigger(coordinateState, data.payload), 3000); // pass in our new coordinate state
        });
        // return sco.none('LISTEN $1~', 'my-channel'); // create a seperate client and never release the connection
    })
    .catch((error) => {
        console.log('Error:', error);
    });


let node1 = {
    lat: nodeCoords.node1.coords1[0],
    lon: nodeCoords.node1.coords1[1],
    id: 1
};

let node2 = {
    lat: nodeCoords.node2.coords1[0],
    lon: nodeCoords.node2.coords1[1],
    id: 2
};

let node3 = {
    lat: nodeCoords.node3.coords1[0],
    lon: nodeCoords.node3.coords1[1],
    id: 3
};

// We run the initial update of Coordinates in our database of node x (id x);
setTimeout(() => updateCoords(node1), 2000);
setTimeout(() => updateCoords(node2), 3000);
setTimeout(() => updateCoords(node3), 1500);
