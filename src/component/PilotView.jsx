import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

axios.defaults.baseURL = "http://localhost:8080";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function PilotView() {
  const [pilots, setPilots] = useState([]);
  const [adminLocation, setAdminLocation] = useState(null);
  const [selectedRange, setSelectedRange] = useState(0);
  const [filteredPilots, setFilteredPilots] = useState([]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    const fetchPilots = async () => {
      try {
        const response = await axios.get("/api/pilots");
        setPilots(response.data);
      } catch (error) {
        console.error("Error fetching pilots:", error.message);
      }
    };

    fetchPilots();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAdminLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          alert("Error while getting location!");
        }
      );
    } else {
      alert("Please enable the location...");
    }
  }, []);

  const handleRangeChange = (event) => {
    const range = parseInt(event.target.value);
    setSelectedRange(range);
    filterPilotsByRange(range);
  };

  const filterPilotsByRange = async (range) => {
    if (!adminLocation) return;

    try {
      const filtered = await Promise.all(
        pilots.map(async (pilot) => {
          const { lat, lng } = pilot.coordinates;
          const distance = await calculateDistance(
            adminLocation.lat,
            adminLocation.lng,
            lat,
            lng
          );
          return { ...pilot, distance };
        })
      );

      const withinRangePilots = filtered.filter(
        (pilot) => pilot.distance <= range
      );
      withinRangePilots.sort((a, b) => a.workExperience - b.workExperience);
      setFilteredPilots(withinRangePilots.slice(0, 11));
    } catch (error) {
      console.error("Error filtering pilots:", error.message);
    }
  };

  const calculateDistance = async (lat1, lon1, lat2, lon2) => {
    try {
      const response = await axios.post("/api/distance", {
        lat1,
        lon1,
        lat2,
        lon2,
      });
      return response.data.distance;
    } catch (error) {
      console.error("Error calculating distance:", error.message);
      return Infinity;
    }
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <h1>Drone Flying Pilots</h1>
        <button
          style={{
            position: "absolute",
            right: "5%",
            height: "30px",
            borderRadius: "5px",
            border: "none",
          }}
        >
          <Link
            to={"/pilots/AddEmployee"}
            style={{
              textDecoration: "none",
              width: "100%",
              height: "100%",
              fontSize: "15px",
              fontWeight: "bold",
              color: "#304463",
            }}
          >
            Add Employee
          </Link>
        </button>
      </div>
      <label htmlFor="range">Enter Range (km): </label>
      <input
        type="number"
        id="range"
        min={0}
        value={selectedRange}
        onChange={handleRangeChange}
      />
      {adminLocation ? (
        <div
          style={{
            margin: "40px 20% 0 20%",
            width: "60%",
          }}
        >
          <MapContainer
            center={[adminLocation.lat, adminLocation.lng]}
            zoom={10}
            style={{ height: "500px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {adminLocation && (
              <Marker position={[adminLocation.lat, adminLocation.lng]}>
                <Popup>You are Here's</Popup>
              </Marker>
            )}
            {filteredPilots.map((pilot) => {
              return (
                <Marker
                  key={pilot._id}
                  position={[pilot.coordinates.lat, pilot.coordinates.lng]}
                >
                  <Popup>
                    <div>
                      <h3 style={{ textAlign: "center", color: "#49108B" }}>
                        {capitalizeFirstLetter(pilot.name)}
                      </h3>
                      <span style={{ textAlign: "center", color: "#E26EE5" }}>
                        Work Experience: {pilot.workExperience} years
                      </span>
                      <br />
                      <span style={{ textAlign: "center", color: "#E26EE5" }}>
                        Location: {capitalizeFirstLetter(pilot.location)}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      ) : (
        <p>Please Enable the Location!</p>
      )}
    </div>
  );
}
