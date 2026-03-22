import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Event {
  event_id: number;
  event_name: string;
  event_details: string;
  event_start_date: string;
  event_end_date: string;
  isSubscribed: boolean;
}

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user_id").then((id) => {
      if (id) setUserId(Number(id));
    });
  }, []);

  useEffect(() => {
    if (userId !== null) fetchEvents();
  }, [page, search, userId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        "https://omnievents-backend.onrender.com/api/events/getAllEvents",
        {
          params: {
            user_id: userId,
            limit: rowsPerPage,
            offset: page * rowsPerPage,
            keyword: search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("res:", res.data);

      setEvents(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (event: Event) => {
    if (!userId) return;

    try {
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        "https://omnievents-backend.onrender.com/api/users_events/subscribeToEvent",
        { event_id: event.event_id, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEvents((prev) =>
        prev.map((e) =>
          e.event_id === event.event_id ? { ...e, isSubscribed: true } : e,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evenements</Text>

      <TextInput
        style={styles.search}
        placeholder="Chercher des événements.."
        value={search}
        onChangeText={(text) => {
          setPage(0);
          setSearch(text);
        }}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : events.length === 0 ? (
        <Text style={styles.noEvents}>Aucun événement trouvé</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.eventName}>{item.event_name}</Text>
              <Text style={styles.eventDetails}>{item.event_details}</Text>
              <Text>
                <Text style={styles.label}>Début:</Text> {item.event_start_date}
              </Text>
              <Text>
                <Text style={styles.label}>Fin:</Text> {item.event_end_date}
              </Text>

              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  item.isSubscribed && styles.subscribedButton,
                ]}
                disabled={item.isSubscribed}
                onPress={() => handleSubscribe(item)}
              >
                <Text style={styles.subscribeText}>
                  {item.isSubscribed ? "Inscrit" : "S'inscrire"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            disabled={page === 0}
            onPress={() => setPage((p) => Math.max(p - 1, 0))}
            style={[styles.pageButton, page === 0 && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Page {page + 1} / {totalPages}
          </Text>

          <TouchableOpacity
            disabled={page + 1 >= totalPages}
            onPress={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            style={[
              styles.pageButton,
              page + 1 >= totalPages && styles.disabledButton,
            ]}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  noEvents: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
  subscribeButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  subscribedButton: {
    backgroundColor: "#ccc",
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  pageButton: {
    backgroundColor: "#gree",
    padding: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageInfo: {
    color: "#fff",
    fontWeight: "bold",
  },
});
