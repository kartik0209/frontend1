import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiServices';

// Fetch company users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/user/company-users');

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Unable to fetch users from the server. Please try again.'
      );
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (values, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        '/admin/user/createEmployee',
        values
      );

      const newUser =
        response?.data?.data && typeof response.data.data === 'object'
          ? response.data.data
          : response?.data && typeof response.data === 'object'
          ? response.data
          : null;

      if (!newUser) {
        throw new Error('User created but response format was unexpected.');
      }

      return newUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Unable to create user. Please try again.'
      );
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/user/${id}`, values);

      const updatedUser =
        response?.data?.data && typeof response.data.data === 'object'
          ? response.data.data
          : response?.data && typeof response.data === 'object'
          ? response.data
          : null;

      // Fallback to merging provided values if API doesn't return a full object
      return updatedUser || { id, ...values };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Unable to update user. Please try again.'
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/user/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Unable to delete user. Please try again.'
      );
    }
  }
);

// Update user status
export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/user/${id}/status`, {
        status,
      });

      const updatedUser =
        response?.data?.data && typeof response.data.data === 'object'
          ? response.data.data
          : response?.data && typeof response.data === 'object'
          ? response.data
          : null;

      // Ensure at least id and status are updated
      return updatedUser || { id, status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Unable to update user status. Please try again.'
      );
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
      .addCase(createUser.pending, (state) => {
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.list = [action.payload, ...(state.list || [])];
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated || !updated.id) return;
        state.list = (state.list || []).map((u) =>
          u.id === updated.id ? { ...u, ...updated } : u
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = (state.list || []).filter((u) => u.id !== id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated || !updated.id) return;
        state.list = (state.list || []).map((u) =>
          u.id === updated.id ? { ...u, ...updated } : u
        );
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;


