<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NInput, NModal, NSelect } from 'naive-ui';
import type { FormInst, FormRules, SelectOption } from 'naive-ui';
import { fetchNodeList } from '@/service/api/node';
import { fetchCreateLink, fetchUpdateLink } from '@/service/api/link';

interface Props {
  visible?: boolean;
  operateType: 'add' | 'edit';
  editingData?: Link | null;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'success'): void;
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  editingData: null
});
const emit = defineEmits<Emits>();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const nodeList = ref<SelectOption[]>([]);

const model = ref<Partial<Link>>({
  name: '',
  status: 'inactive',
  sourceId: undefined,
  targetId: undefined,
  properties: '',
  description: ''
});

const rules: FormRules = {
  name: [
    { required: true, message: '请输入链路名称' },
    { max: 100, message: '链路名称最大长度为100个字符' }
  ],
  status: [{ required: true, message: '请选择链路状态' }],
  sourceId: [{ required: true, message: '请选择源节点' }],
  targetId: [{ required: true, message: '请选择目标节点' }],
  description: [{ max: 500, message: '描述最大长度为500个字符' }]
};

// 获取所有节点列表
async function getNodeList() {
  try {
    const res = await fetchNodeList({ current: 1, size: 999 });
    nodeList.value = (res.records || []).map(node => ({
      label: String(node.name),
      value: node.id
    }));
  } catch {
    window.$message?.error('获取节点列表失败');
  }
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    if (props.operateType === 'edit' && props.editingData?.id) {
      await fetchUpdateLink(props.editingData.id, model.value);
      window.$message?.success('更新成功');
    } else {
      await fetchCreateLink(model.value as Link);
      window.$message?.success('创建成功');
    }

    emit('success');
    handleClose();
  } catch {
    window.$message?.error('操作失败');
  } finally {
    loading.value = false;
  }
}

// 关闭弹窗
function handleClose() {
  formRef.value?.restoreValidation();
  model.value = {
    name: '',
    status: 'inactive',
    sourceId: undefined,
    targetId: undefined,
    properties: '',
    description: ''
  };
  emit('update:visible', false);
  emit('close');
}

// 监听弹窗显示和编辑数据变化
watch(
  () => [props.visible, props.editingData],
  async ([newVisible, newEditingData]) => {
    if (newVisible) {
      await getNodeList();
      if (props.operateType === 'edit' && newEditingData) {
        model.value = { ...newEditingData };
      }
    }
  }
);
</script>

<template>
  <NModal
    :show="visible"
    :title="operateType === 'edit' ? '编辑链路' : '新增链路'"
    preset="dialog"
    :mask-closable="false"
    @close="handleClose"
    @update:show="val => emit('update:visible', val)"
  >
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="链路名称" path="name">
        <NInput v-model:value="model.name" placeholder="请输入链路名称" />
      </NFormItem>

      <NFormItem label="链路状态" path="status">
        <NSelect
          v-model:value="model.status"
          :options="[
            { label: '活动', value: 'active' },
            { label: '非活动', value: 'inactive' },
            { label: '错误', value: 'error' }
          ]"
        />
      </NFormItem>

      <NFormItem label="源节点" path="sourceId">
        <NSelect v-model:value="model.sourceId" :options="nodeList" placeholder="请选择源节点" />
      </NFormItem>

      <NFormItem label="目标节点" path="targetId">
        <NSelect v-model:value="model.targetId" :options="nodeList" placeholder="请选择目标节点" />
      </NFormItem>

      <NFormItem label="属性" path="properties">
        <NInput v-model:value="model.properties" type="textarea" placeholder="请输入链路属性（JSON格式）" />
      </NFormItem>

      <NFormItem label="描述" path="description">
        <NInput v-model:value="model.description" type="textarea" placeholder="请输入链路描述" />
      </NFormItem>
    </NForm>

    <template #action>
      <NButton class="mr-12px" @click="handleClose">取消</NButton>
      <NButton type="primary" :loading="loading" @click="handleSubmit">确定</NButton>
    </template>
  </NModal>
</template>
