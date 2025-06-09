<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDescriptions, NDescriptionsItem, NModal, NSpin, NTag } from 'naive-ui';
import { fetchDeviceDetail } from '@/service/api/device';

interface Props {
  show?: boolean;
  deviceId?: number;
}

interface Emits {
  (e: 'update:show', show: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  deviceId: undefined
});

const emit = defineEmits<Emits>();

const deviceDetail = ref<Device | null>(null);
const loading = ref(false);

async function loadDeviceDetail() {
  if (!props.deviceId) return;

  loading.value = true;
  try {
    deviceDetail.value = await fetchDeviceDetail(props.deviceId);
  } catch {
    window.$message?.error('获取设备详情失败');
  } finally {
    loading.value = false;
  }
}

// 监听设备ID变化
watch(
  () => props.deviceId,
  async (newId: number | undefined) => {
    if (newId) {
      await loadDeviceDetail();
    }
  },
  { immediate: true }
);
</script>

<template>
  <NModal
    :show="show"
    preset="card"
    title="设备详情"
    style="width: 800px"
    :bordered="false"
    @update:show="val => emit('update:show', val)"
  >
    <NSpin :show="loading">
      <NDescriptions v-if="deviceDetail" label-placement="left" bordered>
        <NDescriptionsItem label="设备名称">
          {{ deviceDetail.name }}
        </NDescriptionsItem>
        <NDescriptionsItem label="设备类型">
          <NTag :type="deviceDetail.deviceType === 'user_device' ? 'success' : 'info'">
            {{
              deviceDetail.deviceType === 'user_device'
                ? '用户设备'
                : deviceDetail.deviceType === 'compute_device'
                  ? '网络设备'
                  : '核心网网元'
            }}
          </NTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="MAC地址">
          {{ deviceDetail.mac }}
        </NDescriptionsItem>
        <NDescriptionsItem label="IP地址">
          {{ deviceDetail.ip }}
        </NDescriptionsItem>
        <NDescriptionsItem label="设备状态">
          <NTag :type="deviceDetail.status === 'active' ? 'success' : 'warning'">
            {{ deviceDetail.status === 'active' ? '活动' : '非活动' }}
          </NTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="位置">
          {{ deviceDetail.location }}
        </NDescriptionsItem>
        <NDescriptionsItem label="厂商">
          {{ deviceDetail.vendor }}
        </NDescriptionsItem>
        <NDescriptionsItem label="版本">
          {{ deviceDetail.version }}
        </NDescriptionsItem>
        <NDescriptionsItem v-if="deviceDetail.description" label="描述">
          {{ deviceDetail.description }}
        </NDescriptionsItem>
        <NDescriptionsItem v-if="deviceDetail.configJson" label="配置">
          <pre>{{ deviceDetail.configJson }}</pre>
        </NDescriptionsItem>
        <NDescriptionsItem v-if="deviceDetail.metaData" label="元数据">
          <pre>{{ deviceDetail.metaData }}</pre>
        </NDescriptionsItem>
      </NDescriptions>
    </NSpin>
  </NModal>
</template>
