import React, {Component} from 'react';

import {unByKey} from 'ol/Observable';
import {easeOut} from 'ol/easing';
import {Vector as VectorLayer} from 'ol/layer';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import {Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Stroke, Style} from 'ol/style';

export default class nodeUpdater extends Component {
    constructor(props) {
        super(props);
        this.source = new VectorSource({
            wrapX: false
        });
        this.vector = new VectorLayer({
            source: this.source
        });


        const {ol, coords} = this.props;
        this.nodeId = coords.id;
        ol.addLayer(this.vector);


        this.duration = 2000;
        this.source.on(['changefeature', 'addfeature'], (e) => {
            this.flash(e.feature);
        });
    }

    state = {
        node: false
    };

    componentDidMount() {
        const {coords} = this.props;
        this.activateNode(coords);
    }

    componentDidUpdate(prevProps, prevState) {
        const {coords} = this.props;
        const {node} = this.state;
        if (prevProps.coords !== coords) {
            node.setCoordinates(fromLonLat([
                coords.longitude,
                coords.latitude
            ]));
        }
    }

    flash = (feature) => {
        const start = new Date().getTime();
        const {ol} = this.props;
        let listenerKey;

        const animate = (event) => {
            const {vectorContext} = event;
            const {frameState} = event;
            const flashGeom = feature.getGeometry().clone();
            const elapsed = frameState.time - start;
            const elapsedRatio = elapsed / this.duration;
            // radius will be 5 at start and 30 at end.
            const radius = easeOut(elapsedRatio) * 25 + 5;
            const opacity = easeOut(1 - elapsedRatio);
            const style = new Style({
                image: new CircleStyle({
                    radius: radius,
                    stroke: new Stroke({
                        color: 'rgba(255, 0, 0, ' + opacity + ')',
                        width: 0.25 + opacity
                    })
                })
            });

            vectorContext.setStyle(style);
            vectorContext.drawGeometry(flashGeom);
            if (elapsed > this.duration) {
                unByKey(listenerKey);
                return;
            }
            // tell OpenLayers to continue postcompose animation
            ol.render();
        };

        listenerKey = ol.on('postcompose', animate);
    };


    activateNode = ({longitude, latitude}) => {
        const x = longitude;
        const y = latitude;
        const node = new Point(fromLonLat([x, y]));

        const feature = new Feature(node);
        feature.setId(this.nodeId);

        this.source.addFeature(feature);
        this.setState({
            node: node
        });
    };

    render() {
        return (
            <>
            </>
        );
    }
}
