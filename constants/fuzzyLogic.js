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

export const fuzzyRuleBase = [
  // 🔴 SANGAT BURUK
  { temp: 'low', hum: 'low', light: 'high', growth: 'stressedGrowth' },
  { temp: 'high', hum: 'low', light: 'high', growth: 'stressedGrowth' },
  { temp: 'low', hum: 'low', light: 'low', growth: 'stressedGrowth' },
  { temp: 'high', hum: 'high', light: 'high', growth: 'stressedGrowth' },

  // 🔴 BURUK
  { temp: 'low', hum: 'optimal', light: 'high', growth: 'lowGrowth' },
  { temp: 'low', hum: 'high', light: 'high', growth: 'lowGrowth' },
  { temp: 'optimal', hum: 'low', light: 'high', growth: 'lowGrowth' },
  { temp: 'high', hum: 'optimal', light: 'high', growth: 'lowGrowth' },
  { temp: 'high', hum: 'high', light: 'low', growth: 'lowGrowth' },

  // 🟡 SEDANG
  { temp: 'low', hum: 'optimal', light: 'low', growth: 'moderateGrowth' },
  { temp: 'low', hum: 'high', light: 'low', growth: 'moderateGrowth' },
  { temp: 'low', hum: 'low', light: 'optimal', growth: 'moderateGrowth' },
  { temp: 'low', hum: 'optimal', light: 'optimal', growth: 'moderateGrowth' },
  { temp: 'low', hum: 'high', light: 'optimal', growth: 'moderateGrowth' },
  { temp: 'optimal', hum: 'low', light: 'optimal', growth: 'moderateGrowth' },
  { temp: 'optimal', hum: 'high', light: 'optimal', growth: 'moderateGrowth' },
  { temp: 'high', hum: 'low', light: 'optimal', growth: 'moderateGrowth' },
  { temp: 'high', hum: 'optimal', light: 'optimal', growth: 'moderateGrowth' },
  { temp: 'high', hum: 'high', light: 'optimal', growth: 'moderateGrowth' },
  
  // 🟢 OPTIMAL
  { temp: 'optimal', hum: 'optimal', light: 'optimal', growth: 'highGrowth' },
  { temp: 'optimal', hum: 'low', light: 'low', growth: 'highGrowth' },
  { temp: 'optimal', hum: 'optimal', light: 'low', growth: 'highGrowth' },
  { temp: 'optimal', hum: 'high', light: 'low', growth: 'highGrowth' },
  { temp: 'high', hum: 'low', light: 'low', growth: 'highGrowth' },
  { temp: 'high', hum: 'optimal', light: 'low', growth: 'highGrowth' },
];

function triangle(x, a, b, c) {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

const triangularMF = (x, a, b, c) => {
  if (x <= a) return a === b ? 1 : 0;
  if (x >= c) return c === b ? 1 : 0;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
};

const temperatureFuzzy = (temperature, { TEMPERATURE_LOW, TEMPERATURE_HIGH }) => {
  const mid = (TEMPERATURE_LOW + TEMPERATURE_HIGH) / 2;
  return {
    low: temperature <= TEMPERATURE_LOW ? 1 : triangularMF(temperature, TEMPERATURE_LOW, TEMPERATURE_LOW, mid),
    optimal: triangularMF(temperature, TEMPERATURE_LOW, mid, TEMPERATURE_HIGH),
    high: temperature >= TEMPERATURE_HIGH ? 1 : triangularMF(temperature, mid, TEMPERATURE_HIGH, TEMPERATURE_HIGH),
  };
};

const humidityFuzzy = (humidity, { HUMIDITY_LOW, HUMIDITY_HIGH }) => {
  const mid = (HUMIDITY_LOW + HUMIDITY_HIGH) / 2;
  return {
    low: humidity <= HUMIDITY_LOW ? 1 : triangularMF(humidity, HUMIDITY_LOW, HUMIDITY_LOW, mid),
    optimal: triangularMF(humidity, HUMIDITY_LOW, mid, HUMIDITY_HIGH),
    high: humidity >= HUMIDITY_HIGH ? 1 : triangularMF(humidity, mid, HUMIDITY_HIGH, HUMIDITY_HIGH),
  };
};

const lightIntensityFuzzy = (lightIntensity, { LIGHT_LOW, LIGHT_HIGH }) => {
  const mid = (LIGHT_LOW + LIGHT_HIGH) / 2;
  return {
    low: lightIntensity <= LIGHT_LOW ? 1 : triangularMF(lightIntensity, LIGHT_LOW, LIGHT_LOW, mid),
    optimal: triangularMF(lightIntensity, LIGHT_LOW, mid, LIGHT_HIGH),
    high: lightIntensity >= LIGHT_HIGH ? 1 : triangularMF(lightIntensity, mid, LIGHT_HIGH, LIGHT_HIGH),
  };
};

const applyFuzzyRules = (tempFuzzy, humFuzzy, lightFuzzy, ruleBase) => {
  const results = {
    highGrowth: 0,
    moderateGrowth: 0,
    lowGrowth: 0,
    stressedGrowth: 0,
  };

  ruleBase.forEach(({ temp, hum, light, growth }) => {
    const degree = Math.min(tempFuzzy[temp], humFuzzy[hum], lightFuzzy[light]);
    results[growth] = Math.max(results[growth], degree);
  });

  return results;
};

const defuzzify = (fuzzyValues) => {
  const { lowGrowth, moderateGrowth, highGrowth, stressedGrowth } = fuzzyValues;

  const scores = { 
    lowGrowth: 50, 
    moderateGrowth: 72.5, 
    highGrowth: 92.5,
    stressedGrowth: 20, 
  };

  const numerator = (
    (lowGrowth * scores.lowGrowth) +
    (moderateGrowth * scores.moderateGrowth) +
    (highGrowth * scores.highGrowth) +
    (stressedGrowth * scores.stressedGrowth) 
  );

  const denominator = lowGrowth + moderateGrowth + highGrowth + stressedGrowth;
  const result = denominator === 0 ? scores.lowGrowth : numerator / denominator;

  return result.toFixed(2);
};

// Fungsi utama
export const calculateFuzzyScore = (temperature, humidity, lightIntensity, orchidType) => { 
  const thresholds = orchidThresholds[orchidType] || orchidThresholds.phalaenopsis;

  const tempFuzzy = temperatureFuzzy(temperature, thresholds);
  const humFuzzy = humidityFuzzy(humidity, thresholds);
  const lightFuzzy = lightIntensityFuzzy(lightIntensity, thresholds);

  const fuzzyValues = applyFuzzyRules(tempFuzzy, humFuzzy, lightFuzzy, fuzzyRuleBase);

  const score = defuzzify(fuzzyValues);
  
  const dominantGrowth = Object.entries(fuzzyValues)
    .reduce((a, b) => (a[1] > b[1] ? a : b))[0]; // cari hasil growth tertinggi

  const recommendation = [];

    if (dominantGrowth === 'stressedGrowth' || dominantGrowth === 'lowGrowth') {
    // Tambahkan rekomendasi suhu jika terlalu rendah
    if (temperature < thresholds.TEMPERATURE_LOW) {
      const tempDifference = thresholds.TEMPERATURE_LOW - temperature;
      const estimatedTime = Math.round(tempDifference * 6);
      recommendation.push(`Suhu saat ini cukup rendah (${temperature}°C). Disarankan menaikkan suhu sekitar ${tempDifference}°C dengan menyalakan pemanas selama ±${estimatedTime} menit.`);
    }

    // Tambahkan rekomendasi kelembapan jika terlalu rendah
    if (humidity < thresholds.HUMIDITY_LOW) {

      const deviation = thresholds.HUMIDITY_LOW - humidity;

      const μ_small = triangle(deviation, 0, 0, 5);
      const μ_medium = triangle(deviation, 5, 7.5, 10);
      const μ_large = triangle(deviation, 10, 15, 20);

      // Misalnya semprotkan 40 ml untuk deviasi ringan, atau hingga 121 ml untuk deviasi besar
      const totalMembership = μ_small + μ_medium + μ_large;

      const sprayAmount = totalMembership === 0 ? 0 : (
        (μ_small * 40) +
        (μ_medium * 80) +
        (μ_large * 121.98)
      ) / totalMembership;
      recommendation.push(`Semprotkan air ±${sprayAmount.toFixed(2)} ml di sekitar tanaman untuk menaikkan kelembapan.`);
    }

    // Tambahkan rekomendasi pencahayaan jika terlalu rendah
    if (lightIntensity < thresholds.LIGHT_LOW) {
      const lightDifference = thresholds.LIGHT_LOW - lightIntensity;
      const additionalLamps = Math.ceil(lightDifference / 1500);
      const duration = 3;
      recommendation.push(`Tambahkan ${additionalLamps} lampu LED 10W (total ±${lightDifference} lumen) selama ±${duration} jam.`);
    }
  } else if (dominantGrowth === 'moderateGrowth') {
    recommendation.push("Pertumbuhan cukup baik. Jaga kestabilan lingkungan.");
  } else if (dominantGrowth === 'highGrowth') {
    recommendation.push("Pertumbuhan optimal. Tidak diperlukan tindakan tambahan saat ini.");
  }

  console.log("=== Dari dalam fungsi ===");
  console.log("Suhu:", temperature);
  console.log("Suhu:", tempFuzzy);
  console.log("Kelembapan:", humidity);
  console.log("Kelembapan:", humFuzzy);
  console.log("Cahaya:", lightIntensity);
  console.log("Cahaya:", lightFuzzy);
  console.log("Dominant Growth:", dominantGrowth);
  console.log("Fuzzifikasi:", fuzzyValues);
  console.log("Skor:", score);

  return {
    score, 
    recommendation
  }
};

console.log(calculateFuzzyScore( 29, 59.5, 19000 , 'phalaenopsis'));
// console.log(calculateFuzzyScore((Math.floor(Math.random() * (30 - 16) + 10)),	(Math.floor(Math.random() * (80 - 55) + 40)),	(Math.floor(Math.random() * (21000 - 11000) + 5000)), 'phalaenopsis'));