<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { NDataTable, NTag } from 'naive-ui';
import { fetchLinkList } from '@/services/api/link';
import { useTable } from '@/hooks/common/table';
// 查询参数
const searchParams = ref('');

const { loading, data, columns } = useTable({
  apiFn: fetchLinkList,
  columns: () => [
    { title: 'ID', key: 'id' },
    { title: '链路名称', key: 'name' },
    {
      title: '链路状态',
      key: 'status',
      render(row) {
        return h(NTag, { type: getStatusType(row.status) }, { default: () => row.status });
      }
    },
    { title: '源节点', key: 'source', render: row => row.source?.name },
    { title: '目标节点', key: 'target', render: row => row.target?.name },
    { title: '带宽(Kbps)', key: 'bandwidth' },
    { title: '延迟(us)', key: 'delay' }
  ],
  immediate: true,
  apiParams: {
    current: 1,
    size: 10,
    search: searchParams.value
  }
});

// 状态类型映射
function getStatusType(status: string) {
  switch (status) {
    case 'up':
      return 'success';
    case 'down':
      return 'warning';
    default:
      return 'error';
  }
}

onMounted(() => {
  setInterval(() => {
    if (!data.value) return;
    // 模拟数据更新
    data.value.forEach(item => {
      item.bandwidth = (Math.random() * 100).toFixed(2);
      item.delay = (Math.random() * 100).toFixed(2);
    });
  }, 3000);
});
</script>

<template>
  <div>
    <NDataTable :loading="loading" :columns="columns" :data="data" />
  </div>
</template>
