// src/features/homepageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const homepageSlice = createSlice({
  name: 'homepage',
  initialState: {
    latestData: null,
    fuzzyScore: null,
    selectedOrchid: 'phalaenopsis', // Default jenis anggrek
    individuId: null, // Menyimpan individu_id yang dipilih
    logs: [], // State untuk menyimpan logs
    orchidThresholds: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 60, max: 75 },
      lightIntensity: { min: 12000, max: 20000 },
    },
  },
  reducers: {
    setLatestData: (state, action) => {
      state.latestData = action.payload;
    },
    setFuzzyScore: (state, action) => {
      state.fuzzyScore = action.payload;
    },
    setLogs: (state, action) => {
      const logsWithIndividuId = action.payload.map(log => ({
        ...log,
        individu_id: state.individuId,  // Menambahkan individu_id ke setiap log
      }));
      state.logs = logsWithIndividuId;  // Memperbarui logs dengan individu_id yang sesuai
    },
    setIndividuId: (state, action) => {
      state.individuId = action.payload;  // Update individuId
    },
  },
});

export const { setLatestData, setFuzzyScore, setLogs, setIndividuId } = homepageSlice.actions;
export default homepageSlice.reducer;
