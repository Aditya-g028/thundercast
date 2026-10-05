import { useState, useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

const lightningIcon = new L.DivIcon({
  html: "⚡",
  className: "lightning-marker",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function MapClickHandler({ risk, lightningRisk }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      alert(
        `📍 Selected Location\n\n` +
        `Latitude: ${lat.toFixed(4)}\n` +
        `Longitude: ${lng.toFixed(4)}\n\n` +
        `⛈️ Thunderstorm Risk: ${risk}%\n` +
        `⚡ Lightning Risk: ${lightningRisk}%`
      );
    },
  });

  return null;
}

function WeatherMap({ risk, lightningRisk }) {
  return (
    <MapContainer
      center={[26.8467, 80.9462]}
      zoom={10}
      scrollWheelZoom={true}
      className="real-map"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler
  risk={risk}
  lightningRisk={lightningRisk}
/>

      <div className="map-legend">
  <strong>⚡ Risk Legend</strong>

  <div>
    <span className="legend-color high"></span>
    High Risk
  </div>

  <div>
    <span className="legend-color moderate"></span>
    Moderate Risk
  </div>

  <div>
    <span className="legend-color low"></span>
    Low Risk
  </div>

  <div>
    <span className="legend-lightning">⚡</span>
    Lightning Activity
  </div>
</div>

      {/* Geographical Risk Zones */}

<Circle
  center={[26.8467, 80.9462]}
  radius={9000}
  pathOptions={{
    color: risk >= 65 ? "#ef4444" : risk >= 45 ? "#f97316" : "#22c55e",
    fillColor: risk >= 65 ? "#ef4444" : risk >= 45 ? "#f97316" : "#22c55e",
    fillOpacity: 0.30,
  }}
>
  <Popup>
    📍 Lucknow
    <br />
    Thunderstorm Risk: {risk}%
  </Popup>
</Circle>

<Circle
  center={[26.92, 80.70]}
  radius={6500}
  pathOptions={{
    color: "#f97316",
    fillColor: "#f97316",
    fillOpacity: 0.25,
  }}
>
  <Popup>
    📍 Malihabad Region
    <br />
    Risk Zone: Moderate
  </Popup>
</Circle>

<Circle
  center={[26.94, 81.19]}
  radius={6500}
  pathOptions={{
    color: "#22c55e",
    fillColor: "#22c55e",
    fillOpacity: 0.22,
  }}
>
  <Popup>
    📍 Barabanki Region
    <br />
    Risk Zone: Low
  </Popup>
</Circle>

<Circle
  center={[26.87, 80.80]}
  radius={5000}
  pathOptions={{
    color: "#f97316",
    fillColor: "#f97316",
    fillOpacity: 0.25,
  }}
>
  <Popup>
    📍 Kakori Region
    <br />
    Risk Zone: Moderate
  </Popup>
</Circle>

      {/* Lightning locations */}
    <Marker
    position={[
    26.87 + risk * 0.001,
    80.95 + risk * 0.001,
    ]}
    icon={lightningIcon}
    >
    <Popup>
    ⚡ Lightning Activity
    <br />
    Risk: {lightningRisk}%
    </Popup>
    </Marker>

      <Marker
    position={[
    26.80 + risk * 0.0012,
    80.99 + risk * 0.0008,
  ]}
  icon={lightningIcon}
>
  <Popup>
    ⚡ Lightning Activity
    <br />
    Risk: {lightningRisk}%
  </Popup>
</Marker>

      <Marker
  position={[
    26.92 + risk * 0.0007,
    80.91 - risk * 0.0009,
  ]}
  icon={lightningIcon}
>
  <Popup>
    ⚡ Lightning Activity
    <br />
    Risk: {lightningRisk}%
  </Popup>
</Marker>
    </MapContainer>
  );

}

function App() {
  const [forecast, setForecast] = useState([]);

  const [weatherInputs, setWeatherInputs] = useState([]);

  const [selectedForecast, setSelectedForecast] = useState(3);

  const [lightningForecast, setLightningForecast] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
  fetch("http://127.0.0.1:8000/forecast")
    .then((response) => response.json())
    .then((data) => {
      const formattedForecast = data.times.map((time, index) => ({
        time: time,
        risk: data.thunderstorm[index],
      }));

      setForecast(formattedForecast);
      setLightningForecast(data.lightning);
      setWeatherInputs(data.inputs);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching forecast:", error);
      setLoading(false);
    });
}, []);

  const selectedRisk = forecast[selectedForecast]?.risk ?? 0;

  const selectedLightningRisk =
    lightningForecast[selectedForecast] ?? 0;

  const selectedTime =
    forecast[selectedForecast]?.time ?? "NOW";
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>⚡ THUNDERCAST</h1>
          <p className="prototype-label">
          PROTOTYPE • SIMULATED WEATHER DATA
          </p>  
          <p>AI-Powered Thunderstorm & Lightning Nowcasting</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          SYSTEM ONLINE
        </div>
      </header>

      {/* Risk Cards */}
      <section className="risk-grid">

        <div className="risk-card thunder">
          <span className="card-icon">⛈️</span>
          <div>
            <p>THUNDERSTORM RISK</p>
            <h2>{selectedRisk}<span>%</span></h2>
            <small>Next 60 minutes</small>
          </div>
        </div>

        <div className="risk-card lightning">
          <span className="card-icon">⚡</span>
          <div>
            <p>LIGHTNING RISK</p>
            <h2>{selectedLightningRisk}<span>%</span></h2>
            <small>High activity detected</small>
          </div>
        </div>

        <div className="risk-card confidence">
          <span className="card-icon">🎯</span>
          <div>
            <p>AI CONFIDENCE</p>
            <h2>91<span>%</span></h2>
            <small>Prediction confidence</small>
          </div>
        </div>

        <div className="risk-card window">
          <span className="card-icon">🕐</span>
          <div>
            <p>FORECAST WINDOW</p>
            <h2>30<span>–45m</span></h2>
            <small>Expected activity</small>
          </div>
        </div>

      </section>

      {/* Main Content */}
      <section className="main-grid">

        {/* Map */}
        <div className="panel map-panel">

          <div className="panel-header">
            <div>
              <h2>🌩️ Weather Risk Map</h2>
              <p>AI-generated thunderstorm probability</p>
            </div>

            <select>
              <option>Lucknow Region</option>
              <option>Uttar Pradesh</option>
              <option>India</option>
            </select>
          </div>

          <div className="map">
            <WeatherMap
              risk={selectedRisk}
              lightningRisk={selectedLightningRisk}
            />
          </div>

        </div>

        {/* Alert Panel */}
        <div className="panel alert-panel">

          <div className="panel-header">
            <div>
              <h2>🚨 Early Warning</h2>
              <p className="warning-message">
                {selectedRisk >= 65
                ? "🚨 HIGH THUNDERSTORM RISK — Severe activity may develop within the next 45 minutes. Seek shelter and avoid open areas."
                : selectedRisk >= 45
                ? "⚠️ MODERATE THUNDERSTORM RISK — Weather conditions are becoming unstable. Stay alert for further development."
                : "✅ LOW THUNDERSTORM RISK — No significant thunderstorm activity expected at this time."}
              </p>
            </div>
          </div>

          <div className="alert-box">

            <div className="alert-title">
              <span>⚠️</span>
              HIGH RISK
            </div>

            <h3>Thunderstorm Activity Expected</h3>

            <p>
              Strong thunderstorm development is predicted
              within the next{" "}
              <strong>
                {selectedTime === "NOW"
                ? "few minutes.": selectedTime.toLowerCase() + "."}
              </strong>
            </p>

            <div className="alert-data">
              <div>
                <span>Thunderstorm</span>
                <strong>{selectedRisk}%</strong>
              </div>

              <div>
                <span>Lightning</span>
                <strong>{selectedLightningRisk}%</strong>
              </div>

              <div>
                <span>Confidence</span>
                <strong>91%</strong>
              </div>
            </div>

            <button>VIEW DETAILED ALERT</button>

          </div>

        </div>

      </section>

      {/* Forecast */}
      <section className="panel forecast-panel">

        <div className="panel-header">
          <div>
            <h2>📈 60-Minute Nowcast</h2>
            <p>Predicted thunderstorm probability</p>
          </div>

          <span className="live-badge">● LIVE SIMULATION</span>
        </div>

        <div className="forecast">

  {forecast.map((item, index) => (
    <div
      key={item.time}
      className={`forecast-item ${
        selectedForecast === index ? "selected" : ""
      }`}
      onClick={() => setSelectedForecast(index)}
    >
      <span>{item.time}</span>

      <div className="bar">
        <div style={{ height: `${item.risk}%` }}></div>
      </div>

      <strong>{item.risk}%</strong>
    </div>
  ))}

</div>

      </section>

      {/* Data Sources */}
      <section className="data-section">

        <h2>🛰️ Multi-Source Data Fusion</h2>

        <div className="data-grid">

          <div className="data-card">
            <span>📡</span>
            <div>
              <strong>Radar</strong>
              <small>Reflectivity: {weatherInputs[selectedForecast]?.radar} dBZ</small>
            </div>
            <b>INPUT</b>
          </div>

  <div className="data-card">
    <span>🛰️</span>
    <div>
      <strong>Satellite</strong>
      <small>
  Cloud Activity: {weatherInputs[selectedForecast]?.satellite}%
</small>
    </div>
    <b>INPUT</b>
  </div>

  <div className="data-card">
    <span>⚡</span>
    <div>
      <strong>Lightning</strong>
      <small>
  Density: {weatherInputs[selectedForecast]?.lightning}%
</small>
    </div>
    <b>INPUT</b>
  </div>

  <div className="data-card">
    <span>💧</span>
    <div>
      <strong>Humidity</strong>
      <small>Relative Humidity: {weatherInputs[selectedForecast]?.humidity}%</small>
    </div>
    <b>INPUT</b>
  </div>

  <div className="data-card">
    <span>🌡️</span>
    <div>
      <strong>Temperature</strong>
      <small>Temperature: {weatherInputs[selectedForecast]?.temperature}°C</small>
    </div>
    <b>INPUT</b>
  </div>

</div>

<div className="risk-engine">

  <div className="engine-title">
    <span>🧠</span>
    <strong>AI RISK ENGINE</strong>
  </div>

  <div className="engine-flow">
    <span>Multi-Source Data</span>
    <b>↓</b>
    <span>Risk Analysis</span>
    <b>↓</b>
    <span>Prediction</span>
  </div>

  <div className="engine-results">

    <div className="engine-result">
      <span>⛈️</span>
      <div>
        <small>THUNDERSTORM RISK</small>
        <strong>{selectedRisk}%</strong>
      </div>
    </div>

    <div className="engine-result">
      <span>⚡</span>
      <div>
        <small>LIGHTNING RISK</small>
        <strong>{selectedLightningRisk}%</strong>
      </div>
    </div>

  </div>

</div>

      </section>

      <footer>
        THUNDERCAST • AI-POWERED WEATHER NOWCASTING • PROTOTYPE
      </footer>

    </div>
  );

  
}

export default App;