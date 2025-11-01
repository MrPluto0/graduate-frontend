import { ref } from 'vue';
import { defineStore } from 'pinia';
import { request } from '@/service/request';

export const useMonitorStore = defineStore('monitor', () => {
  const metrics = ref<Api.Monitor.SystemMetrics | null>(null);
  const loading = ref(false);

  async function fetchSystemMetrics() {
    loading.value = true;
    try {
      const res = await request<Api.Monitor.SystemMetrics>({
        url: '/system/metrics',
        method: 'get'
      });
      if (res.data) {
        metrics.value = res.data;
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
