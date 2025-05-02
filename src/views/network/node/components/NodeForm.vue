<script setup lang="ts">
import { ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { NButton, NForm, NFormItem, NInput, NInputNumber, NSpace } from 'naive-ui';
import { fetchCreateNode, fetchUpdateNode } from '@/service/api/node';

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
  position: props.nodeData?.position || [0, 0],
  ...(props.nodeData || {})
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  position: [
    {
      type: 'array',
      required: true,
      message: '请设置节点坐标',
      trigger: ['blur', 'change'],
      len: 2,
      validator: () => {
        const value = formModel.value.position;
        if (!Array.isArray(value) || value.length !== 2) return false;
        return value.every(v => typeof v === 'number');
      }
    }
  ]
};

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

function updatePosition(index: 0 | 1, value: number | null) {
  if (value === null) return;
  // @ts-ignore
  formModel.value.position[index] = value;
}
</script>

<template>
  <NForm ref="formRef" :model="formModel" :rules="rules">
    <NFormItem label="节点名称" path="name">
      <NInput v-model:value="formModel.name" placeholder="请输入节点名称" />
    </NFormItem>

    <NFormItem label="X坐标" path="position.0">
      <NInputNumber
        :value="formModel.position?.[0]"
        placeholder="请输入X坐标"
        @update:value="val => updatePosition(0, val)"
      />
    </NFormItem>

    <NFormItem label="Y坐标" path="position.1">
      <NInputNumber
        :value="formModel.position?.[1]"
        placeholder="请输入Y坐标"
        @update:value="val => updatePosition(1, val)"
      />
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
