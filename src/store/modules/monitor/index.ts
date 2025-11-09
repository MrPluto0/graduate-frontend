import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchSystemMetrics as fetchMetrics } from '@/services/api/monitor';

export const useMonitorStore = defineStore('monitor', () => {
  const metrics = ref<Api.Monitor.SystemMetrics | null>(null);
  const loading = ref(false);

  async function fetchSystemMetrics() {
    loading.value = true;
    try {
      const res = await fetchMetrics();
      if (res) {
        metrics.value = res;
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    metrics,
    loading,
    fetchSystemMetrics
  };
});
