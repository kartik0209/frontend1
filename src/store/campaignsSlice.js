import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiServices';

// Fetch campaigns list
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin/campaign/list', params);

      if (response.data && response.data.success) {
        const campaignData =
          response.data.data || response.data.campaigns || [];

        // Ensure each campaign has a unique key for the table
        const campaignsWithKeys = campaignData.map((campaign) => ({
          ...campaign,
          key: campaign.id || Math.random().toString(36).substr(2, 9),
        }));

        return campaignsWithKeys;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to fetch campaigns'
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch campaigns'
      );
    }
  }
);

// Update campaign status
export const updateCampaignStatus = createAsyncThunk(
  'campaigns/updateCampaignStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/admin/campaign/${id}/status`, {
        status,
      });

      if (response.data && response.data.success) {
        const updated =
          response.data.data && typeof response.data.data === 'object'
            ? response.data.data
            : { id, status };
        return updated;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to update campaign status'
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update campaign status'
      );
    }
  }
);

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: {
    list: [],
    loading: false,
    error: null,
    lastQuery: {},
  },
  reducers: {
    clearCampaignsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action.meta.arg || {};
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
      .addCase(updateCampaignStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated || !updated.id) return;
        state.list = (state.list || []).map((c) =>
          c.id === updated.id ? { ...c, ...updated } : c
        );
      })
      .addCase(updateCampaignStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCampaignsError } = campaignsSlice.actions;
export default campaignsSlice.reducer;



