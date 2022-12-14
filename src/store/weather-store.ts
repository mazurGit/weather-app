import { makeAutoObservable } from "mobx";
import { weatherServices } from "~/services/services";
import { ParsedCurrentDto, ParsedForecastDto } from "~/common/types/types";
import {
  initialCurrentForecastDay,
  initialCurrentWeather,
} from "./common/initial-state-values";
import { DataStatus } from "~/common/enums/enums";

class WeatherStore {
  currentWeather: ParsedCurrentDto = initialCurrentWeather;
  forecast: ParsedForecastDto[] | [] = [];
  dataStatus: DataStatus = DataStatus.IDLE;
  currentForecastDay: ParsedForecastDto = initialCurrentForecastDay;

  constructor() {
    this.getWeather = this.getWeather.bind(this);
    this.updateCurrentForecast = this.updateCurrentForecast.bind(this);
    makeAutoObservable(this);
  }

  updateStatus(dataStatus: DataStatus) {
    this.dataStatus = dataStatus;
  }
  updateData(data: [ParsedCurrentDto, ParsedForecastDto[]]) {
    [this.currentWeather, this.forecast] = data;
  }
  updateCurrentForecast(id: ParsedForecastDto["id"]) {
    const currentForecast = this.forecast.find((day) => day.id === id);
    this.currentForecastDay = currentForecast
      ? currentForecast
      : initialCurrentForecastDay;
  }
  async getWeather() {
    this.updateStatus(DataStatus.PENDING);
    try {
      const data = await weatherServices.getWeather();
      this.updateData(data);
      this.updateStatus(DataStatus.FULFILLED);
    } catch {
      this.updateStatus(DataStatus.REJECTED);
    }
  }
}

export { WeatherStore };
