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

  // **3. Low Growth**
  const lowGrowth = Math.max(
        safeMin(temp.low, hum.low, light.low),
        safeMin(temp.high, hum.high, light.high)
      );

  // **4. Stressed Growth**
  const stressedGrowth = Math.min(temp.high, hum.low);

  // **5. Dormant Growth**
  const dormantGrowth = Math.min(temp.low, Math.max(hum.optimal, light.low));

  const moderateGrowth = (highGrowth === 1 || lowGrowth === 1 || dormantGrowth === 1)
  ? 0
  : Math.max(
      safeMin(temp.optimal, hum.low, light.high),
      safeMin(temp.high, hum.low, light.high),
      safeMin(temp.high, hum.high, light.low),
      safeMin(temp.optimal, hum.optimal, light.low),
      safeMin(temp.low, hum.high, light.optimal)
    );

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

  return result.toFixed(2); // Mengembalikan hasil dengan 2 angka desimal
};


// Fungsi utama
export const calculateFuzzyScore = (temperature, humidity, lightIntensity, orchidType) => { 
  const thresholds = orchidThresholds[orchidType] || orchidThresholds.phalaenopsis;

  const tempFuzzy = temperatureFuzzy(temperature, thresholds);
  const humFuzzy = humidityFuzzy(humidity, thresholds);
  const lightFuzzy = lightIntensityFuzzy(lightIntensity, thresholds);

  const fuzzyValues = fuzzyRules(temperature, humidity, lightIntensity, thresholds);

  const score = defuzzify(fuzzyValues);

  // === Rekomendasi berdasarkan nilai fuzzy ===
   let recommendation = [];

   // Rekomendasi berdasarkan suhu
    if (tempFuzzy.low > 0.5) {
      const tempGap = Math.max(0, thresholds.TEMPERATURE_LOW - temperature);
      const heatingIntensity = Math.round(tempFuzzy.low * tempGap);

      if (heatingIntensity > 0) {
        recommendation.push(
          `Suhu terlalu rendah, tingkatkan suhu sekitar ${heatingIntensity}°C (gunakan pemanas ruangan atau tempatkan tanaman di tempat lebih hangat)`
        );
      } else {
        recommendation.push(
          `Suhu mendekati batas bawah, pertahankan atau sedikit tingkatkan suhu ruangan (misal hindari angin langsung atau dekatkan ke sumber hangat)`
        );
      }
    } else if (tempFuzzy.high > 0.5) {
      recommendation.push(
        "Suhu terlalu tinggi, turunkan suhu lingkungan (hindari sinar matahari langsung, buka ventilasi, atau gunakan kipas)"
      );
    }

    // Rekomendasi berdasarkan kelembapan
  if (humFuzzy.low > 0.1) {
    const airAmount = Math.round(humFuzzy.low * 600); // 0.0–1.0 mapped to 0–300 ml
    recommendation.push(`Siramkan air sekitar ${airAmount} ml untuk menaikkan kelembapan`);
   }
   else if (humFuzzy.high > 0.5) recommendation.push("Kurangi penyiraman dan tingkatkan ventilasi");

  // Rekomendasi berdasarkan intensitas cahaya
    if (lightFuzzy.low > 0.5) {
      const luxDeficit = Math.max(0, thresholds.LIGHT_LOW - lightIntensity);
      const lightDeficitRatio = lightFuzzy.low;
      const area = 0.25; // area pot (m²)
      const extraLumenNeeded = Math.round(luxDeficit * area);
      const estimatedHours = Math.round(lightDeficitRatio * 12);

      if (extraLumenNeeded > 0) {
        recommendation.push(`Tambahkan pencahayaan sebesar ±${extraLumenNeeded} lumen (misal pasang 1-2 lampu LED tambahan atau lebih dekatkan lampu) selama ${estimatedHours} jam`);
      } else if (estimatedHours >= 1) {
        recommendation.push(`Perpanjang durasi pencahayaan selama ${estimatedHours} jam dengan sumber cahaya yang ada (misal tempatkan dekat jendela atau nyalakan lampu lebih lama)`);
      }
    }

  return {
    score, 
    recommendation
  }
};
