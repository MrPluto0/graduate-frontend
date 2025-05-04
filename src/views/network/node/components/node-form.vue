<script setup lang="ts">
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import type { FormInst, FormRules, SelectOption } from 'naive-ui';
import { NButton, NForm, NFormItem, NInput, NInputNumber, NSelect, NSpace } from 'naive-ui';
import { fetchCreateNode, fetchUpdateNode } from '@/service/api/node';
import { fetchDeviceList } from '@/service/api/device';

const props = defineProps<{
  type: 'add' | 'edit';
  nodeData?: Node;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref<FormInst>();
const formModel = ref<Partial<Node>>({
  name: '',
  description: '',
  x: 0,
  y: 0,
  deviceId: props.nodeData?.deviceId || undefined,
  ...(props.nodeData || {})
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  deviceId: [
    {
      required: true,
      message: '请选择关联设备',
      trigger: ['blur', 'change'],
      type: 'number' // 明确指定类型
    }
  ]
};

// 设备选择相关
const deviceOptions = ref<SelectOption[]>([]);
const deviceLoading = ref(false);

// 搜索设备列表
const searchDevices = useDebounceFn(async (search: string) => {
  deviceLoading.value = true;
  try {
    const { records } = await fetchDeviceList({ search, current: 1, size: 10 });
    deviceOptions.value = records.map((device: Device) => ({
      label: `${device.name} (${device.ip})`,
      value: device.id
    }));
  } catch {
    window.$message?.error('获取设备列表失败');
  } finally {
    deviceLoading.value = false;
  }
}, 300);

async function handleSubmit() {
  await formRef.value?.validate();

  try {
    if (props.type === 'add') {
      await fetchCreateNode(formModel.value as Node);
      window.$message?.success('创建成功');
    } else if (props.nodeData?.id) {
      await fetchUpdateNode(props.nodeData.id, formModel.value);
      window.$message?.success('更新成功');
    }
    emit('success');
  } catch {
    window.$message?.error(props.type === 'add' ? '创建失败' : '更新失败');
  }
}
</script>

<template>
  <NForm ref="formRef" :model="formModel" :rules="rules">
    <NFormItem label="节点名称" path="name">
      <NInput v-model:value="formModel.name" placeholder="请输入节点名称" />
    </NFormItem>

    <NFormItem label="关联设备" path="deviceId">
      <NSelect
        v-model:value="formModel.deviceId"
        filterable
        remote
        :loading="deviceLoading"
        :options="deviceOptions"
        placeholder="搜索并选择设备"
        @search="searchDevices"
      />
    </NFormItem>

    <NFormItem label="X坐标" path="position.0">
      <NInputNumber v-model:value="formModel.x" placeholder="请输入X坐标" />
    </NFormItem>

    <NFormItem label="Y坐标" path="position.1">
      <NInputNumber v-model:value="formModel.y" placeholder="请输入Y坐标" />
    </NFormItem>

    <NFormItem label="描述" path="description">
      <NInput v-model:value="formModel.description" type="textarea" placeholder="请输入节点描述" />
    </NFormItem>

    <NSpace justify="end">
      <NButton @click="emit('cancel')">取消</NButton>
      <NButton type="primary" @click="handleSubmit">确定</NButton>
    </NSpace>
  </NForm>
</template>
