<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NForm, NFormItem, NInput, NSelect, useMessage } from 'naive-ui';
import { fetchCreateUser } from '@/service/api/admin';

const form = ref<Partial<User> & { password: string }>({
  username: '',
  email: '',
  role: 'user',
  password: ''
});

const loading = ref(false);
const message = useMessage();

const roles = [
  { label: '用户', value: 'user' },
  { label: '管理员', value: 'admin' }
];

const handleSubmit = async () => {
  loading.value = true;
  try {
    await fetchCreateUser(form.value);
    message.success('用户创建成功');
    // 重置表单
    form.value = { username: '', email: '', role: 'user', password: '' };
  } catch {
    message.error('用户创建失败');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-4">
    <NForm :model="form" label-placement="left" label-width="80px">
      <NFormItem label="用户名">
        <NInput v-model:value="form.username" placeholder="请输入用户名" />
      </NFormItem>
      <NFormItem label="邮箱">
        <NInput v-model:value="form.email" placeholder="请输入邮箱" />
      </NFormItem>
      <NFormItem label="角色">
        <NSelect v-model:value="form.role" :options="roles" placeholder="请选择角色" />
      </NFormItem>
      <NFormItem label="密码">
        <NInput v-model:value="form.password" placeholder="请输入密码" type="password" />
      </NFormItem>
      <NFormItem>
        <NButton :loading="loading" type="primary" @click="handleSubmit">提交</NButton>
      </NFormItem>
    </NForm>
  </div>
</template>

<style scoped>
.p-4 {
  padding: 1rem;
}
</style>
