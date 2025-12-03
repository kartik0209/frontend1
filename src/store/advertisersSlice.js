import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiServices';

// Fetch advertisers list
export const fetchAdvertisers = createAsyncThunk(
  'advertisers/fetchAdvertisers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/common/advertiser/list', params);

      if (response.data && response.data.success) {
        return response.data.data || response.data.advertisers || [];
      }

      return rejectWithValue(
        response.data?.message || 'Failed to fetch advertisers'
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch advertisers'
      );
    }
  }
);

// Create advertiser
export const createAdvertiser = createAsyncThunk(
  'advertisers/createAdvertiser',
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/common/advertiser', values);

      if (response.data && response.data.success) {
        const newAdvertiser =
          response.data.data && typeof response.data.data === 'object'
            ? response.data.data
            : response.data.advertiser || null;
        if (!newAdvertiser) {
          throw new Error('Advertiser created but response format unexpected.');
        }
        return newAdvertiser;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to create advertiser'
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to create advertiser. Please try again.'
      );
    }
  }
);

// Update advertiser
export const updateAdvertiser = createAsyncThunk(
  'advertisers/updateAdvertiser',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/common/advertiser/${id}`,
        values
      );

      if (response.data && response.data.success) {
        const updated =
          response.data.data && typeof response.data.data === 'object'
            ? response.data.data
            : { id, ...values };
        return updated;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to update advertiser'
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to update advertiser. Please try again.'
      );
    }
  }
);

// Delete advertiser
export const deleteAdvertiser = createAsyncThunk(
  'advertisers/deleteAdvertiser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/common/advertiser/${id}`);

      if (response.data && response.data.success) {
        return id;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to delete advertiser'
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to delete advertiser. Please try again.'
      );
    }
  }
);

// Update advertiser status
export const updateAdvertiserStatus = createAsyncThunk(
  'advertisers/updateAdvertiserStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/common/advertiser/${id}/status`,
        { status }
      );

      if (response.data && response.data.success) {
        const updated =
          response.data.data && typeof response.data.data === 'object'
            ? response.data.data
            : { id, status };
        return updated;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to update advertiser status'
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to update advertiser status. Please try again.'
      );
    }
  }
);

const advertisersSlice = createSlice({
  name: 'advertisers',
  initialState: {
    list: [],
    loading: false,
    error: null,
    lastQuery: {},
  },
  reducers: {
    clearAdvertisersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvertisers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action.meta.arg || {};
      })
      .addCase(fetchAdvertisers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAdvertisers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
      .addCase(createAdvertiser.fulfilled, (state, action) => {
        if (action.payload) {
          state.list = [action.payload, ...(state.list || [])];
        }
      })
      .addCase(createAdvertiser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateAdvertiser.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated || !updated.id) return;
        state.list = (state.list || []).map((a) =>
          a.id === updated.id ? { ...a, ...updated } : a
        );
      })
      .addCase(updateAdvertiser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAdvertiser.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = (state.list || []).filter((a) => a.id !== id);
      })
      .addCase(deleteAdvertiser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateAdvertiserStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated || !updated.id) return;
        state.list = (state.list || []).map((a) =>
          a.id === updated.id ? { ...a, ...updated } : a
        );
      })
      .addCase(updateAdvertiserStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAdvertisersError } = advertisersSlice.actions;
export default advertisersSlice.reducer;


