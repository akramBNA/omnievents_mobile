// services/events.service.ts
import API from "./api.service";

export const getEvents = async ({
  userId,
  page,
  limit,
  keyword,
}: {
  userId: number;
  page: number;
  limit: number;
  keyword: string;
}) => {
  const res = await API.get("/events/getAllEvents", {
    params: {
      user_id: userId,
      limit,
      offset: page * limit,
      keyword,
    },
  });

  return res.data;
};

export const subscribeToEvent = async (eventId: number, userId: number) => {
  await API.post("/users_events/subscribeToEvent", {
    event_id: eventId,
    user_id: userId,
  });
};
