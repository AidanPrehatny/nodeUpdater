import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as proj from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {defaults as defaultControls} from 'ol/control';
/* eslint-disable */
import {OSM} from 'ol/source';

import nodeUpdater from './nodeUpdater.jsx';


const mapStateToProps = ({nodeReducer}) => ({nodeReducer});

@connect(mapStateToProps, null)
export default class OlMap extends Component {
    state = {
        ol: new Map({
            target: 'mainMap',
            view: new View({
                center: proj.fromLonLat([-117.571979, 33.022464]),
                zoom: 4,
                maxZoom: 25,
                minZoom: 3
            }),
            layers: [
                new TileLayer({
                    preload: Infinity,
                    source: new OSM({
                        wrapX: false
                    })
                })
            ],
            controls: defaultControls({
                attributionOptions: {
                    collapsible: false
                }
            }),
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true
        })
    };


    render() {
        const {ol} = this.state;
        const {nodeReducer} = this.props;
        console.log('render')
        return (
            <>
                {nodeReducer &&
                    nodeReducer.byId.map((node)=> {
                    if (!nodeReducer.byHash[node].payload) { // if byHash is not of the sampleOfSchema object, then render coordinates
                        return (
                            <NodeUpdater
                                ol={ol}
                                key={nodeReducer.byId[node]}
                                coords={nodeReducer.byHash[node]}
                            />
                        )
                    }
                })}
            </>
        );
    }
}
