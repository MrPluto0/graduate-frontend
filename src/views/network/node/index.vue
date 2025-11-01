<script setup lang="ts">
import { h, ref } from 'vue';
import { NButton, NDataTable, NDrawer, NDrawerContent, NInput, NSpace, useDialog } from 'naive-ui';
import { fetchDeleteNode, fetchNodeList } from '@/services/api/node';
import { useTable } from '@/hooks/common/table';
import DeviceDetailModal from '@/components/business/device-detail-modal.vue';
import NodeForm from './components/node-form.vue';

// 搜索参数
const searchParams = ref({
  search: ''
});

// 侧边栏控制
const showDrawer = ref(false);
const drawerType = ref<'add' | 'edit'>('add');
const editingNode = ref<ApiNode | undefined>();

// 设备详情模态框控制
const showDeviceModal = ref(false);
const currentDeviceId = ref<number>();

const dialog = useDialog();

const { loading, data, columns, pagination, getData } = useTable({
  apiFn: fetchNodeList,
  apiParams: { current: 1, size: 10, search: searchParams.value.search },
  columns: () => [
    { title: 'ID', key: 'id', width: 80 },
    {
      title: '节点名称',
      key: 'name',
      width: 150
    },
    {
      title: '坐标',
      key: 'x',
      width: 150,
      render(row) {
        return `(${row.x}, ${row.y})`;
      }
    },
    {
      title: '描述',
      key: 'description',
      width: 200
    },
    {
      title: '操作',
      key: 'operate',
      width: 250,
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
                  type: 'primary',
                  onClick: () => handleEdit(row)
                },
                { default: () => '编辑' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  onClick: () => handleDelete(row)
                },
                { default: () => '删除' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'info',
                  onClick: () => handleShowDevices(row)
                },
                { default: () => '关联设备' }
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

// 创建节点
function handleAdd() {
  drawerType.value = 'add';
  editingNode.value = undefined;
  showDrawer.value = true;
}

// 编辑节点
function handleEdit(row: ApiNode) {
  drawerType.value = 'edit';
  editingNode.value = row;
  showDrawer.value = true;
}

// 表单提交成功
function handleFormSuccess() {
  showDrawer.value = false;
  getData();
}

// 删除节点
function handleDelete(row: ApiNode) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除节点 "${row.name}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await fetchDeleteNode(String(row.id));
        window.$message?.success('删除成功');
        getData();
      } catch {
        window.$message?.error('删除失败');
      }
    }
  });
}

// 查看关联设备
function handleShowDevices(row: ApiNode) {
  currentDeviceId.value = row.deviceId;
  showDeviceModal.value = true;
}
</script>

<template>
  <div class="p-4">
    <!-- 搜索和操作区域 -->
    <div class="mb-4">
      <NSpace justify="space-between">
        <NSpace>
          <NInput v-model:value="searchParams.search" placeholder="搜索节点名称" @keyup.enter="handleSearch" />
          <NButton type="primary" @click="handleSearch">搜索</NButton>
        </NSpace>

        <NButton type="primary" @click="handleAdd">添加节点</NButton>
      </NSpace>
    </div>

    <!-- 表格 -->
    <NDataTable :loading="loading" :columns="columns" :data="data" :pagination="pagination" />

    <!-- 抽屉 -->
    <NDrawer v-model:show="showDrawer" :width="500">
      <NDrawerContent :title="drawerType === 'add' ? '添加节点' : '编辑节点'">
        <NodeForm
          :type="drawerType"
          :node-data="editingNode"
          @success="handleFormSuccess"
          @cancel="showDrawer = false"
        />
      </NDrawerContent>
    </NDrawer>

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
