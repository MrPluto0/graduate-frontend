<script setup lang="ts">
import { h, ref } from 'vue';
import { NButton, NDataTable, NInput, NSpace, NTag, useDialog } from 'naive-ui';
import { fetchUserList } from '@/services/api/admin';
import { useTable } from '@/hooks/common/table';

// 搜索参数
const searchParams = ref({
  search: ''
});

const dialog = useDialog();

const { loading, data, columns, pagination, getData } = useTable({
  apiFn: fetchUserList,
  apiParams: { current: 1, size: 10, search: searchParams.value.search },
  columns: () => [
    {
      title: '用户名',
      key: 'username',
      width: 120
    },
    {
      title: '邮箱',
      key: 'email',
      width: 200
    },
    {
      title: '角色',
      key: 'role',
      width: 100,
      render(row: User) {
        return h(
          NTag,
          {
            type: row.role === 'admin' ? 'success' : 'info',
            round: true
          },
          { default: () => (row.role === 'admin' ? '管理员' : '用户') }
        );
      }
    },
    {
      title: '创建时间',
      key: 'createdAt',
      width: 180
    },
    {
      title: '操作',
      key: 'operate',
      width: 200,
      render(row: User) {
        return h(
          NSpace,
          {},
          {
            default: () => [
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

// 删除用户
function handleDelete(row: User) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除用户 "${row.username}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        // 假设有删除用户的接口
        await fetchUserList({ current: 1, size: 10 });
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
          <NInput v-model:value="searchParams.search" placeholder="搜索用户名/邮箱" @keyup.enter="handleSearch" />
          <NButton type="primary" @click="handleSearch">搜索</NButton>
        </NSpace>
      </NSpace>
    </div>

    <!-- 表格 -->
    <NDataTable :loading="loading" :columns="columns" :data="data" :pagination="pagination" :bordered="false" />
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
