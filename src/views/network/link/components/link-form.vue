<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { NButton, NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect } from 'naive-ui';
import type { FormInst, FormRules, SelectOption } from 'naive-ui';
import { fetchNodeList } from '@/services/api/node';
import { fetchCreateLink, fetchUpdateLink } from '@/services/api/link';

interface Props {
  visible?: boolean;
  operateType: 'add' | 'edit';
  editingData?: ApiEdge | null;
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
const sourceLoading = ref(false);
const targetLoading = ref(false);

const model = ref<Partial<ApiEdge>>({
  name: '',
  status: 'up',
  sourceId: undefined,
  targetId: undefined,
  properties: '{}',
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
  description: [{ max: 500, message: '描述最大长度为500个字符' }],
  properties: [
    {
      validator: (_, value) => {
        if (!value) return true;
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      },
      message: '请输入有效的 JSON 格式',
      trigger: 'blur'
    }
  ]
};

// 搜索节点列表
const searchNodes = useDebounceFn(async (search: string, type: 'source' | 'target') => {
  const loadingRef = type === 'source' ? sourceLoading : targetLoading;
  loadingRef.value = true;

  try {
    const res = await fetchNodeList({ current: 1, size: 10, search });
    const options = (res.records || []).map(node => ({
      label: node.name,
      value: node.id
    }));

    nodeList.value = options;
  } catch {
    window.$message?.error('获取节点列表失败');
  } finally {
    loadingRef.value = false;
  }
}, 300);

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    const form = {
      ...model.value,
      properties: JSON.parse(model.value.properties || '{}')
    };

    if (props.operateType === 'edit' && props.editingData?.id) {
      await fetchUpdateLink(props.editingData.id, form);
      window.$message?.success('更新成功');
    } else {
      await fetchCreateLink(form as ApiEdge);
      window.$message?.success('创建成功');
    }

    emit('success');
    handleClose();
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
    if (newVisible && props.operateType === 'edit' && newEditingData && !(newEditingData === true)) {
      Object.assign(model.value, newEditingData);
    }
  }
);
</script>

<template>
  <NDrawer :show="visible" :width="500" placement="right" @update:show="val => emit('update:visible', val)">
    <NDrawerContent :title="operateType === 'edit' ? '编辑链路' : '新增链路'" :native-scrollbar="false">
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
              { label: '活动', value: 'up' },
              { label: '非活动', value: 'down' },
              { label: '错误', value: 'unknown' }
            ]"
          />
        </NFormItem>

        <NFormItem label="源节点" path="sourceId">
          <NSelect
            v-model:value="model.sourceId"
            filterable
            remote
            :loading="sourceLoading"
            :options="nodeList"
            placeholder="搜索并选择源节点"
            @search="query => searchNodes(query, 'source')"
          />
        </NFormItem>

        <NFormItem label="目标节点" path="targetId">
          <NSelect
            v-model:value="model.targetId"
            filterable
            remote
            :loading="targetLoading"
            :options="nodeList"
            placeholder="搜索并选择目标节点"
            @search="query => searchNodes(query, 'target')"
          />
        </NFormItem>

        <NFormItem label="属性" path="properties">
          <NInput
            v-model:value="model.properties"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10 }"
            placeholder="请输入链路属性（JSON格式）"
          />
        </NFormItem>

        <NFormItem label="描述" path="description">
          <NInput v-model:value="model.description" type="textarea" placeholder="请输入链路描述" />
        </NFormItem>
      </NForm>

      <template #footer>
        <NButton class="mr-12px" @click="handleClose">取消</NButton>
        <NButton type="primary" :loading="loading" @click="handleSubmit">确定</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
