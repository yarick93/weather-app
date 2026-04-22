import { useState } from "react";
import "./DailyWeather.css"

export default function DailyWeather({ weather, t, degree, windSpeed }) {
  const { daily } = weather;
  const { hourly } = weather
  const [selectedDay, setSelectedDay] = useState(0)
  const now = Math.floor(Date.now() / 1000);
  const baseIndex = selectedDay === 0
    ? hourly.time.findIndex(t => t >= now)
    : selectedDay * 24 + 12;

  const hours = hourly.time.slice(baseIndex - 3, baseIndex + 9);

  const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    61: "🌧️",
    71: "❄️",
    80: "🌧️",
    95: "⛈️",
    99: "⛈️",
  }

  const weatherIconsNight = {
    0: "🌙",
    1: "🌙🗨️",
    2: "🌙☁️",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌕🌧️",
    61: "🌙🌧️",
    71: "🌙❄️",
    80: "🌙🌧️",
    95: "🌙⛈️",
    99: "🌙⛈️",
  }

  const sunrise = daily.sunrise[selectedDay];
  const sunset = daily.sunset[selectedDay];

  return (
    <div
      style={{
        background: `linear-gradient(${
          daily.weather_code[selectedDay] > 50
            ? "#465677,#778AB2"
            : daily.weather_code[selectedDay] < 50 && daily.weather_code[selectedDay] > 2
            ? "#D6E4FE,#FEFBBF"
            : "#D1D3D7,#A2AEBE"
        })`
      }}
      className="dailyWeather"
    >
       <div className="days">
      {daily.time.map((timestamp, i) => {
        const date = new Date(timestamp * 1000);

        const formattedDate = date.toLocaleDateString(t.locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });

        const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

        return (
         
          <div
            style={{
              background: `linear-gradient(${
                daily.weather_code[i] > 50
                  ? "DodgerBlue,lightblue"
                  : "yellow,lightyellow"
              })`
            }}
            key={timestamp}
            onClick={() => setSelectedDay(i)}
            className={i === selectedDay ? "SelectedDailyWeatherItem" : "dailyWeatherItem"}
          >
            <p className="date">{displayDate}</p>
            <p className="weatherIcon">{weatherIcons[daily.weather_code[i]] ?? "🌡️"}</p>
            <div className="temps">
              <p><span>{t.max}:</span> {daily.temperature_2m_max[i]}°C</p>
              <p><span>{t.min}:</span> {daily.temperature_2m_min[i]}°C</p>
            </div>
          </div>
          
        )
      })}
      </div>

      <div className="selected">
        <table className="selectedTable">
          <tbody>
            <tr>
              <td className="firstTd">{t.time}</td>
              {hours.map((timestamp) => (
                <td className="timeTd" key={timestamp}>
                  {new Date(timestamp * 1000).getHours()}:00
                </td>
              ))}
            </tr>
            <tr>
              <td className="firstTd">{t.sky}</td>
              {hours.map((timestamp, i) => {
                const isNightHour = timestamp < sunrise || timestamp > sunset;
                const hourIcons = isNightHour ? weatherIconsNight : weatherIcons;
                return (
                  <td
                    className={isNightHour ? "currentNightWeather" : "currentWeather"}
                    key={timestamp}
                  >
                    {hourIcons[hourly.weather_code[baseIndex - 3 + i]] ?? "🌡️"}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td className="firstTd">{t.temperature}</td>
              {hours.map((timestamp, i) => (
                <td key={timestamp}>{degree==="Цельсий"?hourly.temperature_2m[baseIndex - 3 + i]+"°":hourly.temperature_2m[baseIndex - 3 + i]*2+30+"F"}</td>
              ))}
            </tr>
            <tr>
              <td className="firstTd">{t.humidity}</td>
              {hours.map((timestamp, i) => (
                <td key={timestamp}>{hourly.relative_humidity_2m[baseIndex - 3 + i]}%</td>
              ))}
            </tr>
            <tr>
              <td className="firstTd">{t.wind_speed}</td>
              {hours.map((timestamp, i) => (
                <td key={timestamp}>
                  {windSpeed==="км/Ч"?hourly.wind_speed_10m[baseIndex - 3 + i]+"км/Ч":windSpeed==="М/С"?Math.round(hourly.wind_speed_10m[baseIndex - 3 + i]*10/3.6)/10+"м/С":Math.round(hourly.wind_speed_10m[baseIndex - 3 + i]*10*0.621371)/10+"миль/Ч"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
          <div className="mobileHours">
              <div className="hourRow">
    <div className="hourTime">{t.time}</div>
    <div className="hourCell">{t.sky}</div>
    <div className="hourCell">{t.temperature}</div>
    <div className="hourCell">{t.humidity}</div>
    <div className="hourCell">{t.wind_speed}</div>
  </div>
    {hours.map((timestamp, i) => {
      const isNightHour = timestamp < sunrise || timestamp > sunset;
      const hourIcons = isNightHour ? weatherIconsNight : weatherIcons;
      return (
        <div key={timestamp} className="hourRow">
          <div className="hourTime">{new Date(timestamp * 1000).getHours()}:00</div>
          <div className={isNightHour ? "currentNightWeather" : "currentWeather"}>
            {hourIcons[hourly.weather_code[baseIndex - 3 + i]] ?? "🌡️"}
          </div>
          <div className="hourCell">{degree === "Цельсий" ? hourly.temperature_2m[baseIndex - 3 + i] + "°" : hourly.temperature_2m[baseIndex - 3 + i] * 2 + 30 + "F"}</div>
          <div className="hourCell">{hourly.relative_humidity_2m[baseIndex - 3 + i]}%</div>
          <div className="hourCell">
            {windSpeed === "км/Ч" ? hourly.wind_speed_10m[baseIndex - 3 + i] + "км/Ч" : windSpeed === "М/С" ? Math.round(hourly.wind_speed_10m[baseIndex - 3 + i] * 10 / 3.6) / 10 + "м/С" : Math.round(hourly.wind_speed_10m[baseIndex - 3 + i] * 10 * 0.621371) / 10 + "миль/Ч"}
          </div>
        </div>
      )
    })}
  </div>
      </div>
    </div>
  );
}
