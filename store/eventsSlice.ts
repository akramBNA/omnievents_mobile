import * as eventsService from "@/services/events.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface EventsState {
  events: any[];
  loading: boolean;
  total: number;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  total: 0,
};

export const fetchEventsThunk = createAsyncThunk(
  "events/fetch",
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await eventsService.getEvents(params);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const subscribeThunk = createAsyncThunk(
  "events/subscribe",
  async ({ eventId, userId }: any, { rejectWithValue }) => {
    try {
      await eventsService.subscribeToEvent(eventId, userId);
      return eventId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(subscribeThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.events = state.events.map((e) =>
          e.event_id === id ? { ...e, isSubscribed: true } : e,
        );
      });
  },
});

export default eventsSlice.reducer;
