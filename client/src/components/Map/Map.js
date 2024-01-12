import React from "react";
import {GoogleMap, useLoadScript  } from '@react-google-maps/api'
import mapStyles from "./mapStyles";
import { useState } from "react";
import { getPostsByLocation, setSelectedLocation } from "../../actions/posts";
import { useDispatch } from "react-redux";
import dotenv from 'dotenv'
import { useNavigate } from "react-router-dom";

dotenv.config();
const Map = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    // const [selectedLocation, setSelectedLocation] = useState(null);s
    const libraries = ["places"];
    const mapContainerStyle = {
        width: '70vw',
        height: '75vh'
    }
    const PILANI_BOUNDS = {
        north: -34.36,
        south: -47.35,
        west: 166.28,
        east: -175.81,
      };
    const center = {
        lat: 28.360495609481415,
        lng: 75.58613856281279  
    }
    const options = {
        disableDefaultUI : true,

        styles:mapStyles,
        zoomControl : true,
        clickableIcon: false,
        restriction: {latLngBounds:{north:28.371370260536956 , south: 28.349183579667383, west:75.58138847351074 , east: 75.59428989887238}},
        

    }
    
    const handleMapClick = (event) => {
        console.log(event, 'event');
        if(event && event.fi == undefined){
            const lat = parseFloat(event.latLng.lat());
        const lng = parseFloat(event.latLng.lng());
            const placeId = event.placeId;
        // dispatch(setSelectedLocation(lat, lng))
        sessionStorage.setItem('selectedLocation', JSON.stringify({ lat, lng, placeId }));
        console.log(placeId, 'placeID mapp');
        dispatch(getPostsByLocation({lat, lng, placeId }));
        history(`/posts?=${lat}&lng=${lng}&placeId=${placeId}`);

        // Redirect to the Posts component with lat and lng as query parameters
        // history.push(`/posts`);
        }
        
    }
    const zoom = 18;
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY, 
        libraries,
    })
    if(loadError) return "Error loading maps";
    if(!isLoaded) return "loading Maps"
    return( 
        <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={zoom}
                minZoom = {zoom - 3}
                maxZoom ={zoom + 3}
                disableDefaultUI
                center = {center}
                options={options}
                onClick = {handleMapClick}
        ></GoogleMap>
    )
}
export default Map;