<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { NButton, NDataTable, NSpace } from 'naive-ui';
import { fetchNodeList } from '@/service/api/node';
import { useTable } from '@/hooks/common/table';
import DeviceDetailModal from '@/components/business/device-detail-modal.vue';

// 设备详情模态框控制
const showDeviceModal = ref(false);
const currentDeviceId = ref<number>();

const { loading, data, columns } = useTable({
  apiFn: fetchNodeList,
  apiParams: { current: 1, size: 10 },
  columns: () => [
    { title: 'ID', key: 'id', width: 70 },
    {
      title: '节点名称',
      key: 'name',
      width: 120
    },
    {
      title: '描述',
      key: 'description',
      width: 120
    },
    {
      title: 'CPU(%)',
      key: 'cpu',
      width: 80
    },
    {
      title: '内存(%)',
      key: 'mem',
      width: 80
    },
    {
      title: '磁盘(%)',
      key: 'disk',
      width: 80
    },
    {
      title: '操作',
      key: 'operate',
      width: 60,
      render(row) {
        return h(
          NSpace,
          {},
          {
            default: () => [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'info',
                  onClick: () => handleShowDevices(row)
                },
                { default: () => '查看设备' }
              )
            ]
          }
        );
      }
    }
  ],
  immediate: true,
  showTotal: true
});

// 查看关联设备
function handleShowDevices(row: ApiNode) {
  currentDeviceId.value = row.deviceId;
  showDeviceModal.value = true;
}

onMounted(() => {
  setInterval(() => {
    if (!data.value) return;
    // 模拟数据更新
    data.value.forEach(item => {
      item.cpu = (Math.random() * 100).toFixed(2);
      item.mem = (Math.random() * 100).toFixed(2);
      item.disk = (Math.random() * 100).toFixed(2);
    });
  }, 3000);
});
</script>

<template>
  <div>
    <!-- 表格 -->
    <NDataTable :loading="loading" :columns="columns" :data="data" />

    <!-- 设备详情模态框 -->
    <DeviceDetailModal v-model:show="showDeviceModal" :device-id="currentDeviceId" />
  </div>
</template>

<style scoped>
.p-4 {
  padding: 1rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
</style>
