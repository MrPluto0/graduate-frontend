<script setup lang="ts">
import { computed, ref } from 'vue';
import { NButton, NDescriptions, NDescriptionsItem, NSpace, NTag } from 'naive-ui';
import type { NodeData } from '@antv/g6';
import DeviceDetailModal from './device-detail-modal.vue';

const props = defineProps<{
  node: NodeData;
}>();

const nodeData = computed(() => props.node.data || {});
const showDeviceModal = ref(false);
</script>

<template>
  <div class="p-4">
    <NDescriptions
      title="节点信息"
      label-placement="left"
      bordered
      :column="1"
      size="small"
      :label-style="{ whiteSpace: 'nowrap' }"
    >
      <NDescriptionsItem label="节点ID">
        {{ node.id }}
      </NDescriptionsItem>
      <NDescriptionsItem label="节点名称">
        {{ nodeData.name }}
      </NDescriptionsItem>
      <NDescriptionsItem label="设备ID">
        <NSpace>
          <NTag v-if="nodeData.deviceId" type="success">{{ nodeData.deviceId }}</NTag>
          <NTag v-else type="warning">未绑定设备</NTag>
          <NButton v-if="nodeData.deviceId" size="small" type="primary" @click="showDeviceModal = true">
            查看设备
          </NButton>
        </NSpace>
      </NDescriptionsItem>
      <!-- @vue-skip -->
      <NDescriptionsItem label="坐标">({{ node.style.x.toFixed(0) }}, {{ node.style.y.toFixed(0) }})</NDescriptionsItem>
      <NDescriptionsItem v-if="nodeData.properties" label="属性">
        <pre>{{ nodeData.properties }}</pre>
      </NDescriptionsItem>
      <NDescriptionsItem v-if="nodeData.description" label="描述">
        {{ nodeData.description }}
      </NDescriptionsItem>
    </NDescriptions>

    <!-- @vue-skip -->
    <DeviceDetailModal v-model:show="showDeviceModal" :device-id="nodeData.deviceId" />
  </div>
</template>
