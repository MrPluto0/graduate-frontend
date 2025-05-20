import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAlarmStore = defineStore('alarm', () => {
  const events = ref<AlarmEvent[]>([
    {
      id: 1,
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
      name: 'High CPU Usage',
      eventType: 'CPU',
      status: 'active',
      description: 'CPU usage exceeded 90%',
      deviceId: 1
    },
    {
      id: 2,
      createdAt: '2023-10-02T14:30:00Z',
      updatedAt: '2023-10-02T14:30:00Z',
      name: 'Disk Space Low',
      eventType: 'DISK',
      status: 'resolved',
      description: 'Disk space below 10%',
      deviceId: 2
    },
    {
      id: 3,
      createdAt: '2023-10-03T09:15:00Z',
      updatedAt: '2023-10-03T09:15:00Z',
      name: 'Network Latency High',
      eventType: 'NETWORK',
      status: 'active',
      description: 'Network latency exceeded 200ms',
      deviceId: 3
    },
    {
      id: 4,
      createdAt: '2023-10-04T11:45:00Z',
      updatedAt: '2023-10-04T11:45:00Z',
      name: 'Memory Leak Detected',
      eventType: 'MEMORY',
      status: 'active',
      description: 'Memory usage increased by 50%',
      deviceId: 4
    }
  ]);

  return {
    events
  };
});
