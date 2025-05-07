const orchidThresholds = {
  phalaenopsis: {
    TEMPERATURE_LOW: 18,
    TEMPERATURE_HIGH: 28,
    HUMIDITY_LOW: 60,
    HUMIDITY_HIGH: 75,
    LIGHT_LOW: 12000,
    LIGHT_HIGH: 20000,
  },
};

const triangularMF = (x, a, b, c) => {
  if (x <= a) return a === b ? 1 : 0;  // Jika x lebih kecil dari a, pastikan low tetap 1 jika a = b
  if (x >= c) return c === b ? 1 : 0;  // Jika x lebih besar dari c, pastikan high tetap 1 jika c = b
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
};

// Fungsi keanggotaan untuk suhu, kelembapan, dan intensitas cahaya
const temperatureFuzzy = (temperature, { TEMPERATURE_LOW, TEMPERATURE_HIGH }) => {
  const mid = (TEMPERATURE_LOW + TEMPERATURE_HIGH) / 2;
  return {
    low: temperature <= TEMPERATURE_LOW ? 1 : triangularMF(temperature, TEMPERATURE_LOW - 2, TEMPERATURE_LOW, mid),
    optimal: triangularMF(temperature, TEMPERATURE_LOW, mid, TEMPERATURE_HIGH),
    high: temperature >= TEMPERATURE_HIGH ? 1 : triangularMF(temperature, mid, TEMPERATURE_HIGH, TEMPERATURE_HIGH + 2),
  };
};

const humidityFuzzy = (humidity, { HUMIDITY_LOW, HUMIDITY_HIGH }) => {
  const mid = (HUMIDITY_LOW + HUMIDITY_HIGH) / 2;
  return {
    low: humidity <= HUMIDITY_LOW ? 1 : triangularMF(humidity, HUMIDITY_LOW - 5, HUMIDITY_LOW, mid),
    optimal: triangularMF(humidity, HUMIDITY_LOW, mid, HUMIDITY_HIGH),
    high: humidity >= HUMIDITY_HIGH ? 1 : triangularMF(humidity, mid, HUMIDITY_HIGH, HUMIDITY_HIGH + 5),
  };
};

const lightIntensityFuzzy = (lightIntensity, { LIGHT_LOW, LIGHT_HIGH }) => {
  const mid = (LIGHT_LOW + LIGHT_HIGH) / 2;
  return {
    low: lightIntensity <= LIGHT_LOW ? 1 : triangularMF(lightIntensity, LIGHT_LOW - 1000, LIGHT_LOW, mid),
    optimal: triangularMF(lightIntensity, LIGHT_LOW, mid, LIGHT_HIGH),
    high: lightIntensity >= LIGHT_HIGH ? 1 : triangularMF(lightIntensity, mid, LIGHT_HIGH, LIGHT_HIGH + 1000),
  };
};

// Aturan fuzzy berdasarkan kondisi
const fuzzyRules = (temperature, humidity, lightIntensity, thresholds) => {
  // Hitung nilai fuzzy untuk setiap parameter
  const temp = temperatureFuzzy(temperature, thresholds);
  const hum = humidityFuzzy(humidity, thresholds);
  const light = lightIntensityFuzzy(lightIntensity, thresholds);

  // Fungsi untuk mencari nilai minimum yang valid (> 0)
  const safeMin = (...values) => {
    const valid = values.filter((v) => v > 0);
    return valid.length ? Math.min(...valid) : 0;
  };

  // **1. High Growth**
  const highGrowth = Math.max(
    safeMin(temp.optimal, hum.optimal, light.optimal),
    safeMin(temp.optimal, hum.optimal, light.high),
    safeMin(temp.optimal, hum.high, light.optimal),
    safeMin(temp.high, hum.optimal, light.optimal)
  );

  // **2. Moderate Growth**
  const moderateGrowth = (highGrowth === 1)
    ? 0  // Jika highGrowth sudah 1, moderateGrowth tidak bisa terjadi
    : Math.max(
        safeMin(temp.optimal, hum.low, light.high),
        safeMin(temp.high, hum.low, light.high),
        safeMin(temp.high, hum.high, light.low),
        safeMin(temp.optimal, hum.optimal, light.low),
        safeMin(temp.low, hum.high, light.optimal)
      );

  // **3. Low Growth**
  const lowGrowth = Math.max(
        safeMin(temp.low, hum.low, light.low),
        safeMin(temp.high, hum.high, light.high)
      );

  // **4. Stressed Growth**
  const stressedGrowth = Math.min(temp.high, hum.low);

  // **5. Dormant Growth**
  const dormantGrowth = Math.min(temp.low, Math.max(hum.optimal, light.low));

  return { lowGrowth, moderateGrowth, highGrowth, stressedGrowth, dormantGrowth };
};


// Fungsi Defuzzifikasi
const defuzzify = (fuzzyValues) => {
  // Ambil nilai keanggotaan dari fuzzyValues
  const { lowGrowth, moderateGrowth, highGrowth, stressedGrowth, dormantGrowth } = fuzzyValues;

  // Skor untuk setiap kategori pertumbuhan
  const scores = { 
    lowGrowth: 20, 
    moderateGrowth: 60, 
    highGrowth: 100,
    stressedGrowth: 40, 
    dormantGrowth: 10 
  };

  // Hitung pembilang (Σ μ(x) * skor)
  const numerator = (
    (lowGrowth * scores.lowGrowth) +
    (moderateGrowth * scores.moderateGrowth) +
    (highGrowth * scores.highGrowth) +
    (stressedGrowth * scores.stressedGrowth) +
    (dormantGrowth * scores.dormantGrowth)
  );

  // Hitung penyebut (Σ μ(x))
  const denominator = lowGrowth + moderateGrowth + highGrowth + stressedGrowth + dormantGrowth;
  // console.log("denominator",denominator);

  // Cegah pembagian oleh nol
  const result = denominator === 0 ? scores.lowGrowth : numerator / denominator;

  return result;
};


// Fungsi utama
export const calculateFuzzyScore = (temperature, humidity, lightIntensity, orchidType) => { 
  const thresholds = orchidThresholds[orchidType] || orchidThresholds.phalaenopsis;

  const tempFuzzy = temperatureFuzzy(temperature, thresholds);
  const humFuzzy = humidityFuzzy(humidity, thresholds);
  const lightFuzzy = lightIntensityFuzzy(lightIntensity, thresholds);

  // console.log("=== Fuzzifikasi ===");
  // console.log("Temperature:", temperature);
  // console.log("  → Low:", tempFuzzy.low.toFixed(2), "Optimal:", tempFuzzy.optimal.toFixed(2), "High:", tempFuzzy.high.toFixed(2));
  // console.log("Humidity:", humidity);
  // console.log("  → Low:", humFuzzy.low.toFixed(2), "Optimal:", humFuzzy.optimal.toFixed(2), "High:", humFuzzy.high.toFixed(2));
  // console.log("Light Intensity:", lightIntensity);
  // console.log("  → Low:", lightFuzzy.low.toFixed(2), "Optimal:", lightFuzzy.optimal.toFixed(2), "High:", lightFuzzy.high.toFixed(2));

  const fuzzyValues = fuzzyRules(temperature, humidity, lightIntensity, thresholds);

  // console.log("\n=== Nilai Fuzzy Output ===");
  // console.log("Low Growth:", fuzzyValues.lowGrowth.toFixed(2));
  // console.log("Moderate Growth:", fuzzyValues.moderateGrowth.toFixed(2));
  // console.log("High Growth:", fuzzyValues.highGrowth.toFixed(2));
  // console.log("Stressed Growth:", fuzzyValues.stressedGrowth.toFixed(2));
  // console.log("Dormant Growth:", fuzzyValues.dormantGrowth.toFixed(2));
  // console.log("Numerator:", (fuzzyValues.lowGrowth * 20 + fuzzyValues.moderateGrowth * 60 + fuzzyValues.highGrowth * 100 + fuzzyValues.stressedGrowth * 40 + fuzzyValues.dormantGrowth * 10).toFixed(2));
  // console.log("Denominator:", fuzzyValues.lowGrowth + fuzzyValues.moderateGrowth + fuzzyValues.highGrowth + fuzzyValues.stressedGrowth + fuzzyValues.dormantGrowth);

  const score = defuzzify(fuzzyValues);
  
  // console.log("\n=== Defuzzifikasi ===");
  // console.log("Fuzzy Score:", score.toFixed(2));
  // console.log("========================\n");

  return score;
};


// Contoh penggunaan
// console.log(calculateFuzzyScore(27.54,	64.39,	17766.81, 'phalaenopsis')); // 60
// console.log(calculateFuzzyScore(28.75,	67.62,	17714.68, 'phalaenopsis'));
// console.log(calculateFuzzyScore(27.73,	66.07,	16952.96, 'phalaenopsis'));