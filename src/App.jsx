import { useState, useEffect, use, } from 'react'
import './App.css'
import { supabase } from './supabase/supabase'
import Loading from './Components/Loading/Loading'
import DailyWeather from './Components/DailyWeather/DailyWeather'
import contract from "./assets/img/contract.jpg"
import casino from "./assets/img/casino.jpeg"
import Logo from "./assets/img/logo.png"
import settingsLogo from "./assets/img/settings.png"
import translations from './i18n/translations'

function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") || "Русский"
  )
    const [degree, setDegree] = useState(
    () => localStorage.getItem("degr") || "Цельсий"
  )
      const [windSpeed, setWindSpeed] = useState(
    () => localStorage.getItem("windSpeed") || "км/Ч"
  )
  const t = translations[language]
  const [settings, setSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem("city");
    if (!saved) return 'Кривий Ріг';

    try {
      return JSON.parse(saved);
    } catch (e) {
      return saved || 'Кривий Ріг';
    }
  });
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500);
  }, [])

  useEffect(() => {
    async function getItems() {
      const { data } = await supabase.from('cities_ukraine').select()
      if (data) setItems(data)
    }
    getItems()
  }, [])

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!city) return

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=uk`)
      .then(r => r.json())
      .then(geo => {
        if (!geo.results?.length) {
          setCity(t.city_not_found)
          return Promise.reject('not found')
        }
        const { latitude, longitude } = geo.results[0]

        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,wind_speed_10m_max,weather_code&hourly=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code&timezone=Europe%2FMoscow&timeformat=unixtime`)
      })
      .then(r => r.json())
      .then(data => {
        setWeather(data)
        console.log(data)
      })

  }, [city])

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    console.log(city)
    if (value.length > 0) {
      const filtered = items.filter(item =>
        item.object_name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredResults(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("city", JSON.stringify(city))
    console.log(localStorage.getItem("city"))
  }, [city])

  return (
    <div className='wrapper'>
      {loading ? (<Loading></Loading>) : (
        <>
          {/* <a href="https://ggbet.ua/uk-ua/casino?ref=mk_w186087p2407_google_cpc_22986752068_187979776514_772498189819_kwd-309717566139&affdata[sub_id]=22986752068&affdata[sub_id_2]=kwd-309717566139&affdata[sub_id_3]=772498189819&affdata[click_id]=EAIaIQobChMIsKCkj5__kwMV61qRBR1nzC8qEAAYASAAEgIJhPD_BwE&utm_source=google&utm_medium=cpc&utm_campaign=22986752068&utm_term=kwd-309717566139&utm_content=772498189819_&gad_source=1&gad_campaignid=22986752068&gclid=EAIaIQobChMIsKCkj5__kwMV61qRBR1nzC8qEAAYASAAEgIJhPD_BwE#!/auth/register">
            <img src={casino} alt="" className="casino" />
          </a>
          <a href="https://18-24.army.gov.ua/infantry/#join">
            <img src={contract} alt="" className="contract" />
          </a> */}

          <div className='header'>
            <img
              className='settingsLogo'
              onClick={() => settings ? setSettings(false) : setSettings(true)}
              src={settingsLogo}
              alt=""
              style={{transform:settings?"rotate(90deg)":"rotate(0deg)"}}
            />
            {settings && (
              <div className="settingsMenu">
                <p>Язык</p>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    localStorage.setItem("lang", e.target.value);
                  }}
                >
                  <option value="Русский">Русский</option>
                  <option value="Українська">Українська</option>
                </select>
                <p>Температура</p>
                <select
                  value={degree}
                  onChange={(e) => {
                    setDegree(e.target.value);
                    localStorage.setItem("degr", e.target.value);
                  }}
                  
                >
                  <option value="Цельсий">Цельсий</option>
                  <option value="Фаренгейт">Фаренгейт</option>
                  </select>
                  <p>Скорость ветра</p>
                  <select
                  value={windSpeed}
                  onChange={(e) => {
                    setWindSpeed(e.target.value);
                    localStorage.setItem("windSpeed", e.target.value);
                  }}
                  
                >
                  <option value="км/Ч">км/Ч</option>
                  <option value="М/С">м/с</option>
                  <option value="Миль/Ч">Миль/Ч</option>
                  </select>
              </div>
            )}

            <img src={Logo} alt="" className="logo" />

            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={t.search_placeholder}
              className="search-input"
            />

            {isOpen && (
              <ul className="results-list">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, index) => (
                    <li
                      key={index}
                      className="result-item"
                      onClick={() => {
                        setQuery(item.object_name);
                        setCity(item.object_name);
                        setIsOpen(false);
                      }}
                    >
                      <span className="item-name">{item.object_name}</span>
                    </li>
                  ))
                ) : (
                  <li className="no-results">{t.no_results}</li>
                )}
              </ul>
            )}
          </div>

          <div className="main">
            <h1>{t.selected_city}: {city}</h1>

            <div className="weather">
              {weather && <DailyWeather windSpeed={windSpeed} degree={degree} weather={weather} t={t} />}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
