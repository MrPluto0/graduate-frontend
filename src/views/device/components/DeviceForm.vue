<script setup lang="ts">
import { ref } from 'vue';
import { NForm, NFormItem, NInput, NSelect } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import { fetchCreateDevice, fetchUpdateDevice } from '@/service/api/device';

const props = defineProps<{
  type: 'add' | 'edit';
  deviceData?: Device;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);

const formData = ref({
  name: props.deviceData?.name ?? '',
  deviceType: props.deviceData?.deviceType ?? 'user_device',
  mac: props.deviceData?.mac ?? '',
  ip: props.deviceData?.ip ?? '',
  location: props.deviceData?.location ?? '',
  vendor: props.deviceData?.vendor ?? '',
  version: props.deviceData?.version ?? '',
  description: props.deviceData?.description ?? ''
});

const rules = {
  name: {
    required: true,
    message: '请输入设备名称',
    trigger: 'blur'
  },
  deviceType: {
    required: true,
    message: '请选择设备类型',
    trigger: 'change'
  },
  mac: {
    required: true,
    message: '请输入MAC地址',
    trigger: 'blur'
  },
  ip: {
    required: true,
    message: '请输入IP地址',
    trigger: 'blur'
  },
  vendor: {
    required: true,
    message: '请输入设备厂商',
    trigger: 'blur'
  }
};

const deviceTypes = [
  { label: '用户设备', value: 'user_device' },
  { label: '网络设备', value: 'compute_device' },
  { label: '核心网网元', value: 'network_device' }
];

async function handleSubmit() {
  await formRef.value?.validate();
  loading.value = true;

  try {
    const params = {
      ...formData.value,
      id: props.deviceData?.id
    } as Device;

    if (props.type === 'add') {
      await fetchCreateDevice(params);
    } else {
      await fetchUpdateDevice(params);
    }

    emit('success');
  } catch (error) {
    console.error('保存设备失败:', error);
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  emit('cancel');
}
</script>

<template>
  <NForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="80"
    require-mark-placement="right-hanging"
  >
    <NFormItem label="设备名称" path="name">
      <NInput v-model:value="formData.name" placeholder="请输入设备名称" />
    </NFormItem>

    <NFormItem label="设备类型" path="deviceType">
      <NSelect v-model:value="formData.deviceType" :options="deviceTypes" placeholder="请选择设备类型" />
    </NFormItem>

    <NFormItem label="MAC地址" path="mac">
      <NInput v-model:value="formData.mac" placeholder="请输入MAC地址" />
    </NFormItem>

    <NFormItem label="IP地址" path="ip">
      <NInput v-model:value="formData.ip" placeholder="请输入IP地址" />
    </NFormItem>

    <NFormItem label="位置" path="location">
      <NInput v-model:value="formData.location" placeholder="请输入设备位置" />
    </NFormItem>

    <NFormItem label="厂商" path="vendor">
      <NInput v-model:value="formData.vendor" placeholder="请输入设备厂商" />
    </NFormItem>

    <NFormItem label="版本" path="version">
      <NInput v-model:value="formData.version" placeholder="请输入设备版本" />
    </NFormItem>

    <NFormItem label="描述" path="description">
      <NInput v-model:value="formData.description" placeholder="请输入设备描述" />
    </NFormItem>

    <div class="mt-6 flex justify-end gap-2">
      <NButton @click="handleCancel">取消</NButton>
      <NButton type="primary" :loading="loading" @click="handleSubmit">
        {{ type === 'add' ? '创建' : '保存' }}
      </NButton>
    </div>
  </NForm>
</template>
