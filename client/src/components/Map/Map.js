import React from "react";
import {GoogleMap, useLoadScript, Marker, Infowindow,PlacesService  } from '@react-google-maps/api'
import mapStyles from "./mapStyles";
import { useState } from "react";
import { getPostsByLocation, setSelectedLocation } from "../../actions/posts";
import { useDispatch } from "react-redux";
import dotenv from 'dotenv'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

dotenv.config();
const Map = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    // const [selectedLocation, setSelectedLocation] = useState(null);s
    const libraries = ["places"];
    const mapContainerStyle = {
        width: '70vw',
        height: '75vh'
    }
    const center = {
        lat: 28.360495609481415,
        lng: 75.58613856281279  
    }
    const options = {
        styles:mapStyles,
        zoomControl : true,
    }
    const handleMapClick = (event) => {
        const lat = parseFloat(event.latLng.lat().toFixed(4));
        const lng = parseFloat(event.latLng.lng().toFixed(4));

        // dispatch(setSelectedLocation(lat, lng))
        sessionStorage.setItem('selectedLocation', JSON.stringify({ lat, lng }));
        dispatch(getPostsByLocation({lat, lng}));
        history.push(`/posts?lat=${lat}&lng=${lng}`);

        // Redirect to the Posts component with lat and lng as query parameters
        // history.push(`/posts`);
    }
    const key = process.env.GOOGLE_MAPS_KEY;
    const [markers, setMarkers] = React.useState([]);
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: 'AIzaSyBuGmr1-Jk4-1WMOlhiqcX6n9AzmKv9HQc', 
        libraries,
    })
    if(loadError) return "Error loading maps";
    if(!isLoaded) return "loading Maps"
    return( 
        <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={18}
                center = {center}
                options={options}
                onClick = {handleMapClick}
        ></GoogleMap>
    )
}
export default Map;