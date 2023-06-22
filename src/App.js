import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faMagnifyingGlass,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import sun from './assets/sunV2.png';
import cloud from './assets/cloud.png';
import rain from './assets/rain.png';
import snow from './assets/snow.png';
import lightning from './assets/lightning.png';

function App() {
  const [city, setCity] = useState();
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [favData, setFavData] = useState([]);

  let favList = [];

  //// Affiche les dates au format DD/MM ////
  let dateDisplayer = (date) => {
    switch (date.split('-')[1].split('T')[0]) {
      case '01':
        return date.split('-')[2].split('T')[0] + ' janvier';
      case '02':
        return date.split('-')[2].split('T')[0] + ' fevrier';
      case '03':
        return date.split('-')[2].split('T')[0] + ' mars';
      case '04':
        return date.split('-')[2].split('T')[0] + ' avril';
      case '05':
        return date.split('-')[2].split('T')[0] + ' mai';
      case '06':
        return date.split('-')[2].split('T')[0] + ' juin';
      case '07':
        return date.split('-')[2].split('T')[0] + ' juillet';
      case '08':
        return date.split('-')[2].split('T')[0] + ' août';
      case '09':
        return date.split('-')[2].split('T')[0] + ' septembre';
      case '10':
        return date.split('-')[2].split('T')[0] + ' octobre';
      case '11':
        return date.split('-')[2].split('T')[0] + ' novembre';
      case '12':
        return date.split('-')[2].split('T')[0] + ' decembre';

      default:
        break;
    }
  };

  //// Affiche le png correspondant à la prévision météo ////
  const imageDisplayer = (param) => {
    switch (param) {
      case 0:
      case 1:
        return <img className="h-[200px] mx-auto rounded-full" src={sun} />;
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 30:
      case 31:
      case 32:
      case 40:
      case 41:
      case 42:
      case 43:
      case 44:
      case 45:
      case 46:
      case 47:
      case 48:
      case 70:
      case 71:
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
      case 77:
      case 78:
      case 140:
      case 141:
      case 210:
      case 211:
      case 212:
      case 230:
      case 231:
      case 232:
        return (
          <img
            className="h-[200px] w-[180px] rounded-2xl mx-auto "
            src={rain}
          />
        );

      case 2:
      case 3:
      case 4:
      case 5:
        return <img className="h-[200px] mx-auto" src={cloud} />;
      case 20:
      case 21:
        return (
          <img className="h-[200px] w-[180px] rounded-2xl mx-auto" src={snow} />
        );
      case 6:
      case 7:
        return <img className="w-[200px] mx-auto" src={cloud} />;

      case 100:
      case 101:
      case 102:
      case 103:
      case 104:
      case 105:
      case 106:
      case 107:
      case 108:
        return <img className="w-[200px] mx-auto" src={lightning} />;
      default:
        break;
    }
  };

  //// Recupère grâce à une API le code Insee de la ville dans l'input, puis récupère les prévisions météo sur une autre API qui a besoin de ce code Insee ////
  const getWeatherData = async (e) => {
    e.preventDefault();
    if (city) {
      let cityInseeCode;

      try {
        await axios
          .get(
            `https://geo.api.gouv.fr/communes?nom=${city}&fields=departement&boost=population&limit=5`
          )
          .then((res) => {
            setCityName(res.data[0].nom);
            cityInseeCode = res.data[0].code;
          });

        axios
          .get(
            `https://api.meteo-concept.com/api/forecast/daily?token=e12c8d46b8bb13effbbbbbc08747aaaa9a18860b5e1f15e2a876343e9cf02c68&insee=${cityInseeCode}`
          )
          .then((res) => setWeatherData(res.data.forecast));
      } catch (error) {
        alert('erreur');
      }
    }
  };

  //// Affiche les cartes des prévisions météo des jours à venir (map du state weatherData) ////
  const dataMapper = () => {
    return weatherData.slice(1).map((weatherDayData, index) => (
      <li
        className=" w-[280px] min-w-[280px] bg-black bg-opacity-20 rounded py-2 mr-2"
        key={index}
      >
        <p className="text-xl text-center text-white font-bold tracking-wide my-4">
          {dateDisplayer(weatherDayData.datetime)}
        </p>
        <div className="h-[200px]">
          {imageDisplayer(weatherDayData.weather)}
        </div>

        <p className="text-xl text-center text-white font-bold tracking-wide my-4">
          {weatherDayData.tmax}° C
        </p>
        <p className="text-xl text-center text-white font-bold tracking-wide my-4">
          Vents à {weatherDayData.wind10m} km/h
        </p>
        <p className="text-xl text-center text-white font-bold tracking-wide my-4">
          {weatherDayData.probarain}% de chances de pluie
        </p>
      </li>
    ));
  };

  const addFav = () => {
    if (localStorage.getItem('Ville(s) favorite(s)')) {
      favList = JSON.parse(localStorage.getItem('Ville(s) favorite(s)'));
      setFavData(favList);
    }

    if (!favList.includes(cityName) && favList.length < 3) {
      favList.push(cityName);
      setFavData(favList);
      window.localStorage.setItem(
        'Ville(s) favorite(s)',
        JSON.stringify(favList)
      );
    }
  };

  const deleteFav = (fav) => {
    if (localStorage.getItem('Ville(s) favorite(s)')) {
      favList = JSON.parse(localStorage.getItem('Ville(s) favorite(s)'));
      setFavData(favList);
    }
    if (favList.includes(fav)) {
      let i = favList.indexOf(fav);
      favList.splice(i, 1);
      setFavData(favList);
      window.localStorage.setItem(
        'Ville(s) favorite(s)',
        JSON.stringify(favList)
      );
    }
  };

  //// Recupère les prévisions météo au clic sur un favori ////
  const getWeatherDataFromFav = (favCity, e) => {
    setCity(favCity);
    getWeatherData(e);
  };

  //// Recupere les favoris au montage du composant et les stocke dans le state favData ////
  useEffect(() => {
    if (localStorage.getItem('Ville(s) favorite(s)')) {
      favList = JSON.parse(localStorage.getItem('Ville(s) favorite(s)'));
      setFavData(favList);
    }
  }, []);

  //// Affiche les favoris si il y en a ou un <p> sinon ////
  const favDisplayer = () => {
    if (favData.length > 0) {
      favList = JSON.parse(localStorage.getItem('Ville(s) favorite(s)'));

      return favList.map((fav, index) => (
        <li
          className={`${
            cityName.length > 0 ? 'grid grid-cols-[90%,1fr]' : ''
          }  items-center text-white text-xl w-full mb-1`}
          key={index}
        >
          <p
            className={` ${
              cityName.length > 0 ? 'mr-8 w-[85%] hover:w-[95%]' : 'w-full'
            } bg-black bg-opacity-10 pl-2 py-1 cursor-pointer rounded `}
            onClick={(e) => getWeatherDataFromFav(fav, e)}
          >
            {fav}
          </p>
          {cityName.length > 0 ? (
            <span>
              <FontAwesomeIcon
                icon={faCircleXmark}
                onClick={() => deleteFav(fav)}
                className="cursor-pointer -"
              />
            </span>
          ) : null}
        </li>
      ));
    } else {
      return (
        <p className="text-xl  text-white font-bold tracking-wide ">
          Vous n'avez pas de favori pour le moment
        </p>
      );
    }
  };

  let statsDisplayer = () => {
    let statsArray = [];
    if (weatherData.length > 0) {
      let temperature = 0;
      let wind = 0;
      let sun = 0;
      for (let i = 0; i < weatherData.length; i++) {
        if (temperature === 0) {
          temperature = weatherData[i].tmax;
          wind = weatherData[i].wind10m;
          sun = weatherData[i].sun_hours;
        } else {
          temperature = (temperature + weatherData[i].tmax) / 2;
          wind = (wind + weatherData[i].wind10m) / 2;
          sun = (sun + weatherData[i].sun_hours) / 2;
        }
      }
      let rainDay = [];
      for (let i = 0; i < weatherData.length; i++) {
        if (weatherData[i].probarain > 49) {
          rainDay.push(weatherData[i]);
        }
      }
      statsArray = [
        { name: 'Temperature moyenne', value: Math.round(temperature) + '°C' },
        { name: 'Jours de pluie', value: rainDay.length + ' / 13' },
        { name: 'Vent moyen', value: Math.round(wind) + ' km/h' },
        { name: 'Ensoleillement moyen', value: Math.round(sun) + ' heures' },
      ];
    }
    return statsArray.map((stat, index) => (
      <li
        className="w-[24%] bg-black bg-opacity-10 py-4 px-4  rounded"
        key={index}
      >
        <h4 className="h-[60px] mb-6 ">{stat.name}</h4>
        <p>{stat.value}</p>
      </li>
    ));
  };

  return (
    <div className="h-[100vh] bg-mainBg  flex justify-center items-center">
      <div className="   grid grid-cols-[350px,1fr] py-4   rounded-xl backdrop-blur-2xl">
        <div
          className={`${
            cityName.length > 0 ? 'border-r-2 ' : null
          }  border-white px-4 h-full`}
        >
          <div
            className={`${
              cityName.length > 0 ? 'border-b-2 ' : 'text-center'
            }  pb-4  h-[40%]`}
          >
            <h4 className="text-3xl text-white font-bold tracking-wide mb-4">
              Recherche
            </h4>
            <form
              onSubmit={(e) => getWeatherData(e)}
              className="w-full flex justify-center items-center"
            >
              <div
                className={`flex items-center pb-2 border-b-[1px] ${
                  cityName.length > 0 ? 'mr-8' : ''
                }  `}
              >
                <input
                  type="text"
                  className="bg-transparent w-[95%] text-xl  outline-none text-white"
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Votre ville"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{ color: '#d7dae0' }}
                  className="cursor-pointer"
                />
              </div>
              {cityName ? (
                <div
                  className="flex justify-center items-center rounded-full border-[1px] w-[40px] h-[40px] cursor-pointer  hover:scale-110"
                  onClick={() => addFav()}
                >
                  <FontAwesomeIcon icon={faStar} style={{ color: '#FFFF00' }} />
                </div>
              ) : null}
            </form>

            <h4 className="text-3xl text-white font-bold tracking-wide mt-8 mb-4">
              Favoris ( {favData.length} / 3 )
            </h4>
            <ul className="h-[130px] flex flex-col justify-center items-center">
              {favDisplayer()}
            </ul>
          </div>
          {weatherData.length > 0 ? (
            <div className="flex  justify-center items-center h-[60%]">
              <div className=" w-[280px]  bg-black bg-opacity-20 rounded py-2">
                <p className="text-xl text-center text-white font-bold tracking-wide my-4">
                  {cityName + ' le ' + dateDisplayer(weatherData[0].datetime)}
                </p>
                <div className="h-[200px]">
                  {imageDisplayer(weatherData[0].weather)}
                </div>

                <p className="text-xl text-center text-white font-bold tracking-wide my-4">
                  {weatherData[0].tmax}° C
                </p>
                <p className="text-xl text-center text-white font-bold tracking-wide my-4">
                  Vents à {weatherData[0].wind10m} km/h
                </p>
                <p className="text-xl text-center text-white font-bold tracking-wide my-4">
                  {weatherData[0].probarain}% de chances de pluie
                </p>
              </div>
            </div>
          ) : null}
        </div>
        {cityName.length > 0 ? (
          <div className="px-4 w-full">
            <h4 className="text-5xl text-white font-bold tracking-wide mb-4">
              {cityName}
            </h4>
            <ul className="flex   w-[900px] overflow-x-auto  ">
              {dataMapper()}
            </ul>
            <p className="text-3xl text-white text-center font-bold tracking-wide my-8 w-[900px]">
              13 jours à venir
            </p>
            <ul className="w-[900px] list-none  flex justify-between text-xl text-center text-white font-bold tracking-wide my-4">
              {statsDisplayer()}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
