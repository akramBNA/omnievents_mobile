import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";
import { fetchEventsThunk, subscribeThunk } from "@/store/eventsSlice";

interface Event {
  event_id: number;
  event_name: string;
  event_details: string;
  event_start_date: string;
  event_end_date: string;
  isSubscribed: boolean;
}

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading, total } = useSelector(
    (state: RootState) => state.events,
  );

  const [userId, setUserId] = useState<number | null>(null);
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    AsyncStorage.getItem("user_id").then((id) => {
      if (id) setUserId(Number(id));
    });
  }, []);

  useEffect(() => {
    if (userId !== null) {
      dispatch(
        fetchEventsThunk({
          userId,
          page,
          limit: rowsPerPage,
          keyword: search,
        }),
      );
    }
  }, [userId, page, search, dispatch]);

  const onRefresh = async () => {
    if (!userId) return;
    setRefreshing(true);
    setPage(0);
    await dispatch(
      fetchEventsThunk({
        userId,
        page: 0,
        limit: rowsPerPage,
        keyword: search,
      }),
    );
    setRefreshing(false);
  };

  const handleSubscribe = async (event: Event) => {
    if (!userId) return;

    setLoadingEventId(event.event_id);
    try {
      await dispatch(
        subscribeThunk({ eventId: event.event_id, userId }),
      ).unwrap();
      Alert.alert("Succès!", "Vous êtes inscrit à cet événement !");
    } catch (err: any) {
      Alert.alert("Erreur", err || "Une erreur est survenue");
    } finally {
      setLoadingEventId(null);
    }
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Événements</Text>

      <TextInput
        style={styles.search}
        placeholder="Chercher des événements..."
        value={search}
        onChangeText={(text) => {
          setPage(0);
          setSearch(text);
        }}
      />

      {loading && events.length === 0 ? (
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
                  (item.isSubscribed || loadingEventId === item.event_id) &&
                    styles.subscribedButton,
                ]}
                disabled={item.isSubscribed || loadingEventId === item.event_id}
                onPress={() => handleSubscribe(item)}
              >
                {loadingEventId === item.event_id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.subscribeText}>
                    {item.isSubscribed ? "Inscrit" : "S'inscrire"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
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
    backgroundColor: "#2563eb",
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
