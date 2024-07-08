import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function AddEmployeeDetail() {
  const [pilotAdd, setPilotAdd] = useState({
    name: "",
    workExperience: 0,
    location: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  });
  const [radioBtn, setRadiobBtn] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault();
    setMessage("Please Wait...");
    try {
      const response = await axios.post("/api/pilots", pilotAdd);
      if (response.status === 200) {
        setMessage(response.data.message);
        setPilotAdd({
          name: "",
          workExperience: 0,
          location: "",
          coordinates: {
            lat: 0,
            lng: 0,
          },
        });
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error calculating distance:", error.message);
      setMessage("Invaild City name!");
    }
    setTimeout(() => {
      setMessage("");
    }, 5000);
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <h1>Employee Details</h1>
        <button
          style={{
            position: "absolute",
            right: "5%",
            height: "30px",
            borderRadius: "5px",
            border: "none",
            padding: "5px 15px",
          }}
        >
          <Link
            to={"/"}
            style={{
              textDecoration: "none",
              width: "100%",
              height: "100%",
              fontSize: "15px",
              fontWeight: "bold",
              color: "#304463",
            }}
          >
            Back
          </Link>
        </button>
      </div>
      <form onSubmit={submit}>
        <table>
          <tr>
            <td>
              {" "}
              <label>Name</label>
            </td>
            <td>
              <input
                type="text"
                value={pilotAdd.name}
                required
                onChange={(e) => {
                  setPilotAdd({ ...pilotAdd, name: e.target.value.trim() });
                }}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              <label>Experience</label>
            </td>
            <td>
              <input
                type="number"
                value={pilotAdd.workExperience}
                required
                min={0}
                onChange={(e) => {
                  setPilotAdd({
                    ...pilotAdd,
                    workExperience: e.target.value,
                  });
                }}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              <label>Location</label>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  value={"city"}
                  checked={!radioBtn}
                  required
                  onChange={(e) => {
                    setRadiobBtn(e.target.checked ? false : true);
                    setPilotAdd({
                      ...pilotAdd,
                      coordinates: { lat: 0, lng: 0 },
                    });
                  }}
                ></input>
                Enter City
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  value="current"
                  checked={radioBtn}
                  required
                  onChange={(e) => {
                    setRadiobBtn(e.target.checked ? true : false);
                    if ("geolocation" in navigator) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setPilotAdd({
                            ...pilotAdd,
                            coordinates: { lat: latitude, lng: longitude },
                          });
                        },
                        (error) => {
                          alert("Error while getting location!");
                        }
                      );
                    } else {
                      alert("Please enable the location...");
                    }
                  }}
                ></input>
                Current Location
              </div>
            </td>
          </tr>
          {!radioBtn && (
            <tr>
              <td>
                {" "}
                <label>City</label>
              </td>
              <td>
                <input
                  type="text"
                  value={pilotAdd.location}
                  required
                  onChange={(e) => {
                    setPilotAdd({
                      ...pilotAdd,
                      location: e.target.value.trim(),
                    });
                  }}
                ></input>
              </td>
            </tr>
          )}
        </table>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "20%",
            marginLeft: "40%",
            marginTop: "30px",
          }}
        >
          {" "}
          <button
            className="btn"
            style={{
              padding: "5px 15px",
              fontSize: "15px",
              fontWeight: "bold",
              color: "#304463",
              borderRadius: "5px",
              border: "none",
            }}
            type="submit"
          >
            Submit
          </button>
          <button
            className="btn"
            style={{
              padding: "5px 15px",
              fontSize: "15px",
              fontWeight: "bold",
              color: "#304463",
              borderRadius: "5px",
              border: "none",
            }}
            type="reset"
            onClick={() => {
              setPilotAdd({
                name: "",
                workExperience: 0,
                location: "",
                coordinates: {
                  lat: 0,
                  lng: 0,
                },
              });
            }}
          >
            Reset
          </button>
        </div>
      </form>
      <p
        style={{
          fontWeight: "bold",
          fontFamily: "serif",
          marginTop: "30px",
          fontSize: "20px",
          color: `${
            message === "Successfully Created!" || message === "Please Wait..."
              ? "black"
              : "red"
          }`,
        }}
      >
        {message}
      </p>
    </div>
  );
}
