<script setup lang="ts">
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NDataTable, NInput, NSpace, NTag, useDialog } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchDeleteTask, fetchTaskList } from '@/service/api/algorithm';
import { useTable } from '@/hooks/common/table';
import TaskCreate from '@/components/business/task-create.vue';

const router = useRouter();

// 搜索参数
const searchParams = ref({
  search: ''
});

// 任务创建弹窗控制
const showTaskCreate = ref(false);

const dialog = useDialog();

const { loading, data, columns, pagination, getData } = useTable({
  apiFn: fetchTaskList,
  apiParams: { current: 1, size: 10 },
  columns: () => [
    {
      title: '任务ID',
      key: 'id',
      width: 140,
      align: 'center'
    },
    {
      title: '任务名称',
      key: 'name',
      width: 150,
      align: 'center'
    },
    {
      title: '任务类型',
      key: 'type',
      width: 120,
      align: 'center',
      render(row) {
        const typeMap: Record<string, { label: string; type: any }> = {
          compute: { label: '计算任务', type: 'info' },
          storage: { label: '存储任务', type: 'success' },
          transfer: { label: '传输任务', type: 'warning' }
        };
        const typeInfo = typeMap[row.type] || { label: row.type, type: 'default' };
        return h(
          NTag,
          {
            type: typeInfo.type,
            round: true
          },
          { default: () => typeInfo.label }
        );
      }
    },
    {
      title: '数据大小',
      key: 'dataSize',
      width: 120,
      align: 'center',
      render(row) {
        const sizeInMB = (row.dataSize / 1000).toFixed(2);
        return `${sizeInMB} MB`;
      }
    },
    {
      title: '优先级',
      key: 'priority',
      width: 100,
      align: 'center',
      render(row) {
        const priorityMap: Record<number, { label: string; type: any }> = {
          1: { label: '低', type: 'default' },
          2: { label: '中', type: 'warning' },
          3: { label: '高', type: 'error' }
        };
        const priorityInfo = priorityMap[row.priority] || { label: String(row.priority), type: 'default' };
        return h(
          NTag,
          {
            type: priorityInfo.type,
            size: 'small'
          },
          { default: () => priorityInfo.label }
        );
      }
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      align: 'center',
      render(row) {
        // Go 后端状态值: 0-等待调度, 1-排队中, 2-计算中, 3-已完成, 4-失败
        const statusMap: Record<number, { label: string; type: any }> = {
          0: { label: '等待调度', type: 'default' },
          1: { label: '排队中', type: 'warning' },
          2: { label: '计算中', type: 'info' },
          3: { label: '已完成', type: 'success' },
          4: { label: '失败', type: 'error' }
        };
        const status = Number(row.status);
        const statusInfo = statusMap[status] || { label: `未知(${row.status})`, type: 'default' };
        return h(
          NTag,
          {
            type: statusInfo.type,
            round: true
          },
          { default: () => statusInfo.label }
        );
      }
    },
    {
      title: '分配节点',
      key: 'assignedCommId',
      width: 120,
      align: 'center',
      render(row) {
        return row.assignedCommId !== undefined && row.assignedCommId !== null
          ? `节点 ${row.assignedCommId}`
          : '-';
      }
    },
    {
      title: '创建时间',
      key: 'createdAt',
      width: 180,
      render(row) {
        return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '操作',
      key: 'operate',
      width: 150,
      fixed: 'right',
      align: 'center',
      render(row) {
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  onClick: () => handleViewDetail(row)
                },
                { default: () => '详情' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  onClick: () => handleDelete(row)
                },
                { default: () => '删除' }
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

// 搜索处理
function handleSearch() {
  getData();
}

// 创建任务
function handleCreate() {
  showTaskCreate.value = true;
}

// 任务创建成功
function handleTaskCreateSuccess() {
  showTaskCreate.value = false;
  getData();
}

// 查看任务详情
function handleViewDetail(row: any) {
  router.push(`/device/task-detail?id=${row.id}`);
}

// 删除任务
function handleDelete(row: any) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除任务 "${row.name}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await fetchDeleteTask(String(row.id));
        window.$message?.success('删除成功');
        getData();
      } catch {
        window.$message?.error('删除失败');
      }
    }
  });
}
</script>

<template>
  <div class="p-4">
    <!-- 搜索和操作区域 -->
    <div class="mb-4">
      <NSpace justify="space-between">
        <NSpace>
          <NInput v-model:value="searchParams.search" placeholder="搜索任务名称" @keyup.enter="handleSearch" />
          <NButton type="primary" @click="handleSearch">搜索</NButton>
        </NSpace>

        <NButton type="primary" @click="handleCreate">创建任务</NButton>
      </NSpace>
    </div>

    <!-- 表格 -->
    <NDataTable
      :loading="loading"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :bordered="false"
      :scroll-x="1200"
    />

    <!-- 任务创建弹窗 -->
    <TaskCreate v-model:show="showTaskCreate" @success="handleTaskCreateSuccess" />
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
