import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiServices';

// Async thunk to fetch approved publishers
export const fetchApprovedPublishers = createAsyncThunk(
  'publishers/fetchApproved',
  async (campaignId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/common/publisher/${campaignId}/approved-publishers`
      );
      if (response.data?.success) {
        return response.data.data || [];
      } else {
        return rejectWithValue(response.data?.message || 'Failed to load publishers');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'An error occurred while fetching publishers');
    }
  }
);

const publishersSlice = createSlice({
  name: 'publishers',
  initialState: {
    approvedPublishers: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearApprovedPublishers: (state) => {
      state.approvedPublishers = [];
      state.lastUpdated = null;
    },
    resetPublishersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedPublishers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedPublishers.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedPublishers = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchApprovedPublishers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearApprovedPublishers, resetPublishersError } = publishersSlice.actions;
export default publishersSlice.reducer;