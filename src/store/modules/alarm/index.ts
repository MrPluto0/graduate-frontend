import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchAlarmList } from '@/services/api/alarm';

export const useAlarmStore = defineStore('alarm', () => {
  const events = ref<AlarmEvent[]>([]);
  const loading = ref(false);
  const total = ref(0);

  async function fetchAlarms(current = 1, size = 10) {
    loading.value = true;
    try {
      const res = await fetchAlarmList({ current, size });
      if (res) {
        events.value = res.records;
        total.value = res.total;
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    events,
    loading,
    total,
    fetchAlarms
  };
});
