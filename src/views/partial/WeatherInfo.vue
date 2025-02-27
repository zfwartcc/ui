<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Current Weather</span>
      <p>The runways listed here are suggestions. If there is a controller online, they may be using different runways than those listed here. Please always check with the controller's ATIS prior to planning your runways.</p>
    </div>
    <div class="table_overflow_wrapper" v-if="numStationsLoaded === Object.keys(stations).length" >
      <table class="striped compact">
        <thead>
          <tr>
            <th>Airport</th>
            <th>Wind</th>
            <th>Conditions</th>
            <th>Landing</th>
            <th>Departing</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in stations" :key="station.icao">
            <td><span class="hide-on-med-and-down">{{ station.fullName }} <strong>({{ station.icao }})</strong></span><span class="hide-on-large-only">{{ station.icao }}</span></td>
            <td>{{ formatWind(station) }}</td>
            <td><div class="airport_conditions" v-html="getConditions(station)"></div></td>
            <td>{{ station.getLanding() }}</td>
            <td>{{ station.getDeparting() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-content loading" v-else>
      <Spinner />
    </div>
  </div>
</template>

<script>
import { zabApi } from '@/helpers/axios.js';
import parse from 'metar-parser';

export default {
  data() {
    return {
      icao: ['KDFW', 'KDAL', 'KOKC'],
      stations: {
        KDFW: {
          icao: "KDFW",
          fullName: "Dallas-Fort Worth International Airport",
          metar: null, 
          parsedMetar: null,
          configs: {
            landing: {
              N: '31R/35C/35R/36L',
              S: '13R/17L/17C/18R'

            }, 
            departing: {
              N: '36R/35L',
              S: '17R/18L'
            }
          },
          getLanding: function() {
            if (this.parsedMetar.wind.speedKt <= 5) {
                return this.configs.landing.S;
            } else if (this.parsedMetar.wind.direction >= 90 && this.parsedMetar.wind.direction <= 270 && this.parsedMetar.wind.speedKt >= 6) {
                return this.configs.landing.S;
            } else if ((this.parsedMetar.wind.direction < 90 || this.parsedMetar.wind.direction > 270) && this.parsedMetar.wind.speedKt >= 6) {
                return this.configs.landing.N;
            } else {
                return this.configs.landing.S;
            }
          },
          getDeparting: function() {
            if (this.parsedMetar.wind.speedKt <= 5) {
                return this.configs.departing.S;
            } else if (this.parsedMetar.wind.direction >= 90 && this.parsedMetar.wind.direction <= 270 && this.parsedMetar.wind.speedKt >= 6) {
                return this.configs.departing.S;
            } else if ((this.parsedMetar.wind.direction < 90 || this.parsedMetar.wind.direction > 270) && this.parsedMetar.wind.speedKt >= 6) {
                return this.configs.departing.N;
            } else {
                return this.configs.departing.S;
            }
          }
        }, 
        KDAL: {
          icao: "KDAL",
          fullName: "Dallas Love Field Airport",
          metar: null, 
          parsedMetar: null,
          configs: {
            landing: {
              NE: '4L/4R',
              NW: '31L/31C/31R',
              SE: '13L/13C/13R',
              SW: '22L/22R',
            }, 
            departing: {
              NE: '4L/4R',
              NW: '31L/31C/31R',
              SE: '13L/13C/13R',
              SW: '22L/22R',
            }
          },
          getLanding: function() {
            if ((this.parsedMetar.wind.speedKt <= 9) || (this.parsedMetar.wind.direction >= 280 && this.parsedMetar.wind.direction <= 360 && this.parsedMetar.wind.speedKt >= 10)) {
                return this.configs.landing.NW;
            } else if (this.parsedMetar.wind.direction >= 10 && this.parsedMetar.wind.direction <= 100 && this.parsedMetar.wind.speedKt >= 10) {
                return this.configs.landing.NE;
            } else if (this.parsedMetar.wind.direction >= 180 && this.parsedMetar.wind.direction <= 270 && this.parsedMetar.wind.speedKt >= 10) {
                return this.configs.landing.SW;
            } else if (this.parsedMetar.wind.direction >= 110 && this.parsedMetar.wind.direction <= 170 && this.parsedMetar.wind.speedKt >= 10) {
                return this.configs.landing.SE;
            } else {
                return this.configs.landing.NW;
            }
          },
          getDeparting: function() {
            if ((this.parsedMetar.wind.speedKt <= 9) || (this.parsedMetar.wind.direction >= 280 && this.parsedMetar.wind.direction <= 360 && this.parsedMetar.wind.speedKt >= 10)) {
                return this.configs.departing.NW;
            } else if (this.parsedMetar.wind.direction >= 10 && this.parsedMetar.wind.direction <= 100 && this.parsedMetar.wind.speedKt >= 10) {
                return this.configs.departing.NE;
            } else if (this.parsedMetar.wind.direction >= 180 && this.parsedMetar.wind.direction <= 270 && this.parsedMetar.wind.speedKt >= 10) {
                return this.configs.departing.SW;
            } else if (this.parsedMetar.wind.direction >= 110 && this.parsedMetar.wind.direction <= 170 && this.parsedMetar.wind.speedKt >= 10) {
                return this.configs.departing.SE;
            } else {
                return this.configs.departing.NW;
            }
          }
        },
        KOKC: {
          icao: "KOKC",
          fullName: "Will Rogers World Airport",
          metar: null, 
          parsedMetar: null,
          configs: {
            landing: {
              W: '25R/25L',
              SW: '25/19',
              S: '19R/19L',
              E: '7R/7L',
              SE: '7R/13',
              NA: '1L',
              N: '1L/1R'
            }, 
            departing: {
              SW: '25L/25R',
              S: '19R',
              NE: '7R',
              N: '1L/1R',
              E: '7R/13',
              S2: '19R/19L',
              NE2: '7R/7L'
            }
          },
          getLanding: function() {
            if (this.parsedMetar.time.hour >= 4 && this.parsedMetar.time.hour <= 12) {
                return this.configs.landing.NA; // Night Noise Abatement
            } else if (this.parsedMetar.wind.speedKt <= 5) {
                return this.configs.landing.W;
            } else if (this.parsedMetar.wind.direction >= 310 || this.parsedMetar.wind.direction < 40 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.landing.N;
            } else if (this.parsedMetar.wind.direction >= 140 && this.parsedMetar.wind.direction <= 220 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.landing.S;
            } else if (this.parsedMetar.wind.direction >= 40 && this.parsedMetar.wind.direction <= 130 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.landing.E;
            } else if (this.parsedMetar.wind.direction >= 220 && this.parsedMetar.wind.direction <= 300 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.landing.W;
            } else {
                return this.configs.landing.W;
            }
          },
          getDeparting: function() {
            if (this.parsedMetar.time.hour >= 4 && this.parsedMetar.time.hour <= 12) {
                return this.configs.departing.S; // Night Noise Abatement
            } else if (this.parsedMetar.wind.speedKt <= 5) {
                return this.configs.departing.S;
            } else if (this.parsedMetar.wind.direction >= 310 || this.parsedMetar.wind.direction < 40 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.departing.N;
            } else if (this.parsedMetar.wind.direction >= 140 && this.parsedMetar.wind.direction <= 220 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.departing.S2;
            } else if (this.parsedMetar.wind.direction >= 40 && this.parsedMetar.wind.direction <= 130 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.departing.NE2;
            } else if (this.parsedMetar.wind.direction >= 220 && this.parsedMetar.wind.direction <= 300 && this.parsedMetar.wind.speedKt >= 25) {
                return this.configs.departing.SW;
            } else {
                return this.configs.departing.S;
            }
          }
        }, 
        /*KRFD: {
          icao: "KRFD",
          fullName: "Chicago Rockford International Airport",
          metar: null, 
          parsedMetar: null,
          configs: {
            landing: {
              SE: '25',
              SW: '25/19',
              NE: '7/1',
            }, 
            departing: {
              SE: '25',
              SW: '25/19',
              NE: '7/1',
            }
          },
          getLanding: function() {
            if(this.parsedMetar.wind.speedKt <= 6) return this.configs.landing.SE;
            else {
              if(this.parsedMetar.wind.direction >= 0 && this.parsedMetar.wind.direction < 130) return this.configs.landing.SW;
              else if(this.parsedMetar.wind.direction >= 130 && this.parsedMetar.wind.direction < 310) return this.configs.landing.NE;
              else return this.configs.landing.SE;
            }
          },
          getDeparting: function() {
            if(this.parsedMetar.wind.speedKt <= 6) return this.configs.departing.SE;
            else {
              if(this.parsedMetar.wind.direction >= 0 && this.parsedMetar.wind.direction < 130) return this.configs.departing.SW;
              else if(this.parsedMetar.wind.direction >= 130 && this.parsedMetar.wind.direction < 310) return this.configs.departing.NE;
              else return this.configs.departing.SE;
            }
          }
        }, 
        KCID: {
          icao: "KCID",
          fullName: "The Eastern Iowa Airport",
          metar: null, 
          parsedMetar: null,
          configs: {
            landing: {
              NE: '9',
              SW: '27',
            }, 
            departing: {
              NE: '9',
              SW: '27',
            }
          },
          getLanding: function() {
            if(this.parsedMetar.wind.speedKt <= 6) return this.configs.landing.NE;
            else {
              if(this.parsedMetar.wind.direction >= 130 && this.parsedMetar.wind.direction < 310) return this.configs.landing.SW;
              else return this.configs.landing.NE;
            }
          },
          getDeparting: function() {
            if(this.parsedMetar.wind.speedKt <= 6) return this.configs.departing.NE;
            else {
              if(this.parsedMetar.wind.direction >= 130 && this.parsedMetar.wind.direction < 310) return this.configs.departing.SW;
              else return this.configs.departing.NE;
            }
          }
        }*/
      },
      numStationsLoaded: 0
    };
  },
  async mounted() {
    await this.getWeatherForAirports();
  },
  methods: {
    async getWeatherForAirports() {
      for (const station of this.icao) {
        const { data } = await zabApi.get(`/ids/stations/${station}`);
        this.stations[station].metar = data.metar;
        this.stations[station].parsedMetar = parse(data.metar);
        this.numStationsLoaded++;

      }
      
    },
    formatWind(station) {
      if(station.parsedMetar.wind.speedKt < 4) return 'Calm';
      else if(!('speedKt' in station.parsedMetar.wind)) return 'Unknown';
      const paddedWind = `0${station.parsedMetar.wind.direction}`.slice(-3);
      return `${paddedWind}@${station.parsedMetar.wind.speedKt}${(station.parsedMetar.wind.gust?`G${station.parsedMetar.wind.gust}`:'')}`;
    },
    getConditions(station) {
      const visibility = station.parsedMetar.visibility.miles;
      const clouds = station.parsedMetar.clouds.filter(cloud => cloud.code === "OVC" || cloud.code === "BKN");
      const verticalVisibility = station.parsedMetar.verticalVisibility || Number.MAX_VALUE;
      let Conditions;

      // Check for LIFR conditions
      if (visibility < 1 || clouds.some(cloud => cloud.altitude < 500) || verticalVisibility < 500) {
        Conditions = `<i class="material-icons weather_icon">wb_cloudy</i>LIFR`;
      }
      // Check for IFR conditions
      else if (visibility >= 1 && visibility < 3 || clouds.some(cloud => cloud.altitude >= 500 && cloud.altitude < 1000) || (verticalVisibility >= 500 && verticalVisibility < 1000)) {
        Conditions = `<i class="material-icons weather_icon">wb_cloudy</i>IFR`;
      }
      // Check for MVFR conditions
      else if (visibility >= 3 && visibility <= 5 || clouds.some(cloud => cloud.altitude >= 1000 && cloud.altitude <= 3000) || (verticalVisibility >= 1000 && verticalVisibility <= 3000)) {
        Conditions = `<i class="material-icons weather_icon">wb_cloudy</i>MVFR`;
      }
      // Otherwise, assume VFR conditions
      else {
        Conditions = `<i class="material-icons weather_icon">wb_sunny</i>VFR`;
      }
      return Conditions;
    }  
  }
};
</script>

<style scoped lang="scss">
.airport_conditions {
  display: inline-flex;
  align-items: center;
  height: 33px;

  &::v-deep(i) {
    margin-right: 5px;
  }
}
.loading {
  text-align: center;
}

.progress {
  max-width: 500px;
  margin: 0 auto;
}

.table_overflow_wrapper {
  width: 100%;
  overflow-x: auto;
}

.weather_icon {
  padding-top: 1em;
}

tbody tr {
  transition: background-color .3s ease;
  &:hover {
    background-color: #eaeaea!important;
  }
}
</style>