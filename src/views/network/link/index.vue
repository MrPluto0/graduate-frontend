<script setup lang="ts">
import { h, ref } from 'vue';
import { NButton, NDataTable, NInput, NTag } from 'naive-ui';
import { fetchDeleteLink, fetchLinkList } from '@/service/api/link';
import { useTable } from '@/hooks/common/table';
import LinkForm from './components/link-form.vue';

// 抽屉相关状态
const drawerVisible = ref(false);
const operateType = ref<'add' | 'edit'>('add');
const editingData = ref<Link | null>(null);

// 查询参数
const searchParams = ref('');

const { loading, data, pagination, getData, columns } = useTable({
  apiFn: fetchLinkList,
  columns: () => [
    { type: 'selection', key: 'selection' },
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
    { title: '描述', key: 'description' },
    {
      title: '操作',
      key: 'operate',
      render(row) {
        return h('div', { class: 'flex-y-center' }, [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              class: 'mr-12px',
              onClick: () => handleEdit(row.id)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDelete(row.id)
            },
            { default: () => '删除' }
          )
        ]);
      }
    }
  ],
  immediate: true,
  apiParams: {
    current: 1,
    size: 10,
    keyword: searchParams.value
  }
});

// 状态类型映射
function getStatusType(status: string) {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'warning';
    default:
      return 'error';
  }
}

// 删除链路
async function handleDelete(id: number) {
  try {
    await window.$dialog?.warning({
      title: '警告',
      content: '确定要删除该链路吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await fetchDeleteLink(id);
        window.$message?.success('删除成功');
        getData();
      }
    });
  } catch {
    window.$message?.error('删除失败');
  }
}

// 编辑链路
function handleEdit(id: number) {
  editingData.value = data.value.find(item => item.id === id) || null;
  operateType.value = 'edit';
  drawerVisible.value = true;
}

// 查询处理
async function handleSearch() {
  getData();
}

// 关闭抽屉
function closeDrawer() {
  drawerVisible.value = false;
  editingData.value = null;
}

// 新增链路
function handleAdd() {
  operateType.value = 'add';
  drawerVisible.value = true;
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between">
      <div class="flex">
        <NInput v-model:value="searchParams" class="mr-16px w-200px" placeholder="请输入链路名称" />
        <NButton type="primary" @click="handleSearch">查询</NButton>
      </div>
      <NButton type="primary" @click="handleAdd">新增链路</NButton>
    </div>

    <NDataTable :loading="loading" :columns="columns" :data="data" :pagination="pagination" />

    <LinkForm
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :editing-data="editingData"
      @success="getData"
      @close="closeDrawer"
    />
  </div>
</template>
