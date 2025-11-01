<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useGraphStore } from '@/store/modules/graph';
import { fetchStartAlg } from '@/services/api/algorithm';

interface Props {
  show: boolean;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useGraphStore();

const showModal = computed({
  get: () => props.show,
  set: val => emit('update:show', val)
});

// 表单数据
const formData = reactive({
  name: '',
  type: 'compute',
  priority: 1,
  dataSizeType: 'fixed' as 'fixed' | 'random',
  fixedDataSize: 50,
  minDataSize: 10,
  maxDataSize: 100,
  batchCount: 1,
  targetUserId: undefined as number | undefined
});

// 获取用户设备节点列表
const userNodes = computed(() => {
  return store.nodes
    .filter(node => node?.data?.nodeType === 'user_equipment')
    .map(node => ({
      label: String(node.data?.name || `用户${node.id}`),
      value: Number(node.id)
    }));
});

// 任务类型选项
const taskTypeOptions = [
  { label: '计算任务', value: 'compute' },
  { label: '存储任务', value: 'storage' },
  { label: '传输任务', value: 'transfer' }
];

// 优先级选项
const priorityOptions = [
  { label: '低', value: 1 },
  { label: '中', value: 2 },
  { label: '高', value: 3 }
];

// 数据大小类型选项
const dataSizeTypeOptions = [
  { label: '固定值', value: 'fixed' },
  { label: '随机值', value: 'random' }
];

const loading = ref(false);

// 生成随机数据大小
function generateDataSize(): number {
  if (formData.dataSizeType === 'fixed') {
    return formData.fixedDataSize;
  }
  return Math.random() * (formData.maxDataSize - formData.minDataSize) + formData.minDataSize;
}

// 提交表单
async function handleSubmit() {
  loading.value = true;
  try {
    const tasks: Partial<Api.Alg.UserTask>[] = [];

    for (let i = 0; i < formData.batchCount; i += 1) {
      let targetUserId = formData.targetUserId;

      // 如果没有指定用户，随机选择一个
      if (!targetUserId && userNodes.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * userNodes.value.length);
        targetUserId = userNodes.value[randomIndex].value;
      }

      if (!targetUserId) {
        window.$message?.error('没有可用的用户节点');
        return;
      }

      const dataSize = generateDataSize();

      tasks.push({
        userId: targetUserId,
        name: formData.batchCount > 1 ? `${formData.name}_${i + 1}` : formData.name,
        type: formData.type,
        dataSize: dataSize * 1000 * 1000 * 8, // 转换为 bit
        priority: formData.priority
      });
    }

    await fetchStartAlg(tasks);
    window.$message?.success(`成功创建 ${tasks.length} 个任务`);
    emit('success');
    showModal.value = false;
    resetForm();
  } catch (error) {
    window.$message?.error('创建任务失败');
  } finally {
    loading.value = false;
  }
}

// 重置表单
function resetForm() {
  formData.name = '';
  formData.type = 'compute';
  formData.priority = 1;
  formData.dataSizeType = 'fixed';
  formData.fixedDataSize = 100;
  formData.minDataSize = 50;
  formData.maxDataSize = 200;
  formData.batchCount = 1;
  formData.targetUserId = undefined;
}

// 取消
function handleCancel() {
  showModal.value = false;
  resetForm();
}
</script>

<template>
  <NModal v-model:show="showModal" preset="card" title="创建任务" class="w-600px">
    <NForm :model="formData" label-placement="left" label-width="120" size="medium">
      <NFormItem label="任务名称" required>
        <NInput v-model:value="formData.name" placeholder="请输入任务名称" />
      </NFormItem>

      <NFormItem label="任务类型" required>
        <NSelect v-model:value="formData.type" :options="taskTypeOptions" />
      </NFormItem>

      <NFormItem label="优先级" required>
        <NSelect v-model:value="formData.priority" :options="priorityOptions" />
      </NFormItem>

      <NFormItem label="目标用户">
        <NSelect
          v-model:value="formData.targetUserId"
          :options="userNodes"
          placeholder="不选择则随机分配"
          clearable
        />
      </NFormItem>

      <NFormItem label="数据大小类型" required>
        <NRadioGroup v-model:value="formData.dataSizeType">
          <NSpace>
            <NRadio v-for="item in dataSizeTypeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </NRadio>
          </NSpace>
        </NRadioGroup>
      </NFormItem>

      <NFormItem v-if="formData.dataSizeType === 'fixed'" label="数据大小(MB)" required>
        <NInputNumber v-model:value="formData.fixedDataSize" :min="1" :max="1000" :step="10" class="w-full" />
      </NFormItem>

      <template v-else>
        <NFormItem label="最小数据大小(MB)" required>
          <NInputNumber v-model:value="formData.minDataSize" :min="1" :max="1000" :step="10" class="w-full" />
        </NFormItem>
        <NFormItem label="最大数据大小(MB)" required>
          <NInputNumber v-model:value="formData.maxDataSize" :min="1" :max="1000" :step="10" class="w-full" />
        </NFormItem>
      </template>

      <NFormItem label="批量创建数量" required>
        <NInputNumber v-model:value="formData.batchCount" :min="1" :max="100" :step="1" class="w-full" />
        <template #feedback>
          <span class="text-gray-500 text-sm">批量创建时，任务名称会自动添加编号后缀</span>
        </template>
      </NFormItem>
    </NForm>

    <template #footer>
      <NSpace justify="end">
        <NButton @click="handleCancel">取消</NButton>
        <NButton type="primary" :loading="loading" @click="handleSubmit">创建任务</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
.w-600px {
  max-width: 600px;
}
</style>
