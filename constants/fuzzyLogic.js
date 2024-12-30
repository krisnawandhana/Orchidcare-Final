const TEMPERATURE_THRESHOLD = 23;
const TEMPERATURE_THRESHOLD_HIGH = 29;
const HUMIDITY_THRESHOLD = 50;
const HUMIDITY_THRESHOLD_HIGH = 70;
const LIGHT_INTENSITY_THRESHOLD = 150;
const LIGHT_INTENSITY_THRESHOLD_HIGH = 500;

const temperatureFuzzy = (temperature) => {
  return {
    cold: temperature <= TEMPERATURE_THRESHOLD ? 1 : temperature < TEMPERATURE_THRESHOLD + 2 ? (TEMPERATURE_THRESHOLD + 2 - temperature) / 2 : 0,
    normal: temperature >= TEMPERATURE_THRESHOLD && temperature <= TEMPERATURE_THRESHOLD_HIGH
      ? (TEMPERATURE_THRESHOLD_HIGH - Math.abs(temperature - (TEMPERATURE_THRESHOLD + (TEMPERATURE_THRESHOLD_HIGH - TEMPERATURE_THRESHOLD) / 2))) / 3
      : 0,
    hot: temperature >= TEMPERATURE_THRESHOLD_HIGH ? (temperature - TEMPERATURE_THRESHOLD_HIGH) / 5 : 0,
  };
};

const humidityFuzzy = (humidity) => {
  return {
    low: humidity <= HUMIDITY_THRESHOLD ? 1 : humidity < HUMIDITY_THRESHOLD + 10 ? (HUMIDITY_THRESHOLD + 10 - humidity) / 10 : 0,
    medium: humidity >= HUMIDITY_THRESHOLD && humidity <= HUMIDITY_THRESHOLD_HIGH
      ? (HUMIDITY_THRESHOLD_HIGH - Math.abs(humidity - (HUMIDITY_THRESHOLD + (HUMIDITY_THRESHOLD_HIGH - HUMIDITY_THRESHOLD) / 2))) / 25
      : 0,
    high: humidity >= HUMIDITY_THRESHOLD_HIGH ? (humidity - HUMIDITY_THRESHOLD_HIGH) / 20 : 0,
  };
};

const lightIntensityFuzzy = (lightIntensity) => {
  return {
    dim: lightIntensity <= LIGHT_INTENSITY_THRESHOLD ? 1 : lightIntensity < LIGHT_INTENSITY_THRESHOLD + 50 ? (LIGHT_INTENSITY_THRESHOLD + 50 - lightIntensity) / 50 : 0,
    optimal: lightIntensity >= LIGHT_INTENSITY_THRESHOLD && lightIntensity <= LIGHT_INTENSITY_THRESHOLD_HIGH
      ? (LIGHT_INTENSITY_THRESHOLD_HIGH - Math.abs(lightIntensity - (LIGHT_INTENSITY_THRESHOLD + (LIGHT_INTENSITY_THRESHOLD_HIGH - LIGHT_INTENSITY_THRESHOLD) / 2))) / 350
      : 0,
    bright: lightIntensity >= LIGHT_INTENSITY_THRESHOLD_HIGH ? (lightIntensity - LIGHT_INTENSITY_THRESHOLD_HIGH) / 200 : 0,
  };
};

const fuzzyRules = (temperature, humidity, lightIntensity) => {
  const temp = temperatureFuzzy(temperature);
  const hum = humidityFuzzy(humidity);
  const light = lightIntensityFuzzy(lightIntensity);

  const safeMax = (...values) => Math.max(...values.filter((v) => !isNaN(v)));
  const safeMin = (...values) => Math.min(...values.filter((v) => !isNaN(v)));

  const excellentGrowth = 0.9 * safeMin(temp.normal, hum.medium, light.optimal);
  const moderateGrowth = safeMax(
    safeMin(temp.normal, hum.medium, light.optimal * 0.5),
    safeMin(temp.normal, hum.medium, light.bright * 0.5),
    safeMin(temp.normal, hum.high, light.optimal * 0.5)
  );
  const poorGrowth = safeMax(temp.cold, hum.low, light.dim);

  return { poorGrowth, moderateGrowth, excellentGrowth };
};

const defuzzify = (fuzzyValues) => {
  const { poorGrowth, moderateGrowth, excellentGrowth } = fuzzyValues;
  const scores = { poorGrowth: 20, moderateGrowth: 60, excellentGrowth: 100 };

  const numerator =
    poorGrowth * scores.poorGrowth +
    moderateGrowth * scores.moderateGrowth +
    excellentGrowth * scores.excellentGrowth;

  const denominator = poorGrowth + moderateGrowth + excellentGrowth;
  return denominator === 0 ? scores.poorGrowth : numerator / denominator;
};

export const calculateFuzzyScore = (temperature, humidity, lightIntensity) => {
  const fuzzyValues = fuzzyRules(temperature, humidity, lightIntensity);
  return defuzzify(fuzzyValues);
};
