<script setup lang="ts">
import { h, ref } from 'vue';
import { NButton, NDataTable, NDrawer, NDrawerContent, NInput, NSpace, NTag, useDialog } from 'naive-ui';
import { fetchDeleteDevice, fetchDeviceList } from '@/service/api/device';
import { useTable } from '@/hooks/common/table';
import DeviceForm from './components/DeviceForm.vue';

// 搜索参数
const searchParams = ref({
  keyword: ''
});

// 侧边栏控制
const showDrawer = ref(false);
const drawerType = ref<'add' | 'edit'>('add');
const editingDevice = ref<Device | undefined>();

const dialog = useDialog();

const { loading, data, columns, pagination, getData } = useTable({
  apiFn: fetchDeviceList,
  apiParams: { current: 1, size: 10, keyword: searchParams.value.keyword },
  columns: () => [
    {
      title: '设备名称',
      key: 'name',
      width: 150
    },
    {
      title: '设备类型',
      key: 'deviceType',
      width: 120
    },
    {
      title: 'MAC地址',
      key: 'mac',
      width: 140
    },
    {
      title: 'IP地址',
      key: 'ip',
      width: 120
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render(row) {
        return h(
          NTag,
          {
            type: row.status === 'online' ? 'success' : 'error',
            round: true
          },
          { default: () => (row.status === 'online' ? '在线' : '离线') }
        );
      }
    },

    {
      title: '操作',
      key: 'operate',
      width: 200,
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

// 创建设备
function handleAdd() {
  drawerType.value = 'add';
  editingDevice.value = undefined;
  showDrawer.value = true;
}

// 编辑设备
function handleEdit(row: Device) {
  drawerType.value = 'edit';
  editingDevice.value = row;
  showDrawer.value = true;
}

// 表单提交成功
function handleFormSuccess() {
  showDrawer.value = false;
  getData();
}

// 删除设备
function handleDelete(row: Device) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除设备 "${row.name}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await fetchDeleteDevice(String(row.id));
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
          <NInput v-model:value="searchParams.keyword" placeholder="搜索设备名称/IP/MAC" @keyup.enter="handleSearch" />
          <NButton type="primary" @click="handleSearch">搜索</NButton>
        </NSpace>

        <NButton type="primary" @click="handleAdd">添加设备</NButton>
      </NSpace>
    </div>

    <!-- 表格 -->
    <NDataTable :loading="loading" :columns="columns" :data="data" :pagination="pagination" :bordered="false" />

    <!-- 抽屉 -->
    <NDrawer v-model:show="showDrawer" :width="500">
      <NDrawerContent :title="drawerType === 'add' ? '添加设备' : '编辑设备'">
        <DeviceForm
          :type="drawerType"
          :device-data="editingDevice"
          @success="handleFormSuccess"
          @cancel="showDrawer = false"
        />
      </NDrawerContent>
    </NDrawer>
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
