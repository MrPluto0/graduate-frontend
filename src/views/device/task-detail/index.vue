<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NButton, NCard, NDescriptions, NDescriptionsItem, NProgress, NSpin, NStatistic, NTag } from 'naive-ui';
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import { fetchTaskDetail } from '@/services/api/algorithm';
import { bitToMB } from '@/utils/data';
import ProgressChart from './components/progress-chart.vue';
import DelayChart from './components/delay-chart.vue';
import EnergyChart from './components/energy-chart.vue';
import GraphData from './components/graph-data.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const task = ref<Api.Alg.Task | null>(null);

// 获取任务详情
async function getTaskDetail() {
  try {
    loading.value = true;
    const taskId = route.query.id as string;
    const data = await fetchTaskDetail(taskId);
    task.value = data;
  } catch (error) {
    window.$message?.error('获取任务详情失败');
  } finally {
    loading.value = false;
  }
}

// 获取任务类型标签
function getTaskTypeTag(type: string) {
  const typeMap: Record<string, { label: string; type: any }> = {
    compute: { label: '计算任务', type: 'info' },
    storage: { label: '存储任务', type: 'success' },
    transfer: { label: '传输任务', type: 'warning' }
  };
  return typeMap[type] || { label: type, type: 'default' };
}

// 获取优先级标签
function getPriorityTag(priority: number) {
  const priorityMap: Record<number, { label: string; type: any }> = {
    1: { label: '低', type: 'default' },
    2: { label: '中', type: 'warning' },
    3: { label: '高', type: 'error' }
  };
  return priorityMap[priority] || { label: String(priority), type: 'default' };
}

// 获取状态标签
function getStatusTag(status: number) {
  // Go 后端状态：0-等待调度,1-排队中,2-计算中,3-已完成,4-失败
  const statusMap: Record<number, { label: string; type: any }> = {
    0: { label: '等待调度', type: 'default' },
    1: { label: '排队中', type: 'warning' },
    2: { label: '计算中', type: 'info' },
    3: { label: '已完成', type: 'success' },
    4: { label: '失败', type: 'error' }
  };
  return statusMap[status] || { label: `未知(${status})`, type: 'default' };
}

// 计算处理进度
function getProgress() {
  if (!task.value || !task.value.dataSize) return 0;
  const total = Number(task.value.dataSize) || 0;
  const history = task.value.metricsHistory || [];
  let processed = 0;
  if (history.length > 0) {
    const last = history[history.length - 1];
    processed = Number(last.cumulativeProcessed ?? last.processedData ?? 0);
  }
  return total > 0 ? Math.min(Math.round((processed / total) * 100), 100) : 0;
}

// 返回列表
function handleBack() {
  router.push('/device/task');
}

onMounted(() => {
  getTaskDetail();
});
</script>

<template>
  <div class="relative p-4">
    <!-- 右上角操作按钮 -->
    <div class="absolute right-6 top-6 z-10 flex gap-2">
      <NButton secondary circle @click="getTaskDetail" :loading="loading">
        <template #icon>
          <Icon icon="mdi:refresh" :class="{ 'animate-spin': loading }" />
        </template>
      </NButton>
      <NButton secondary circle @click="handleBack">
        <template #icon>
          <Icon icon="mdi:arrow-left" />
        </template>
      </NButton>
    </div>

    <NSpin :show="loading">
      <div v-if="task" class="space-y-4">
        <!-- 基本信息卡片 -->
        <NCard title="基本信息" class="card-wrapper">
          <NDescriptions :column="3" label-placement="left">
            <NDescriptionsItem label="任务名称">{{ task.name }}</NDescriptionsItem>
            <NDescriptionsItem label="用户ID">{{ task.userId }}</NDescriptionsItem>
            <NDescriptionsItem label="任务类型">
              <NTag :type="getTaskTypeTag(task.type).type" round>
                {{ getTaskTypeTag(task.type).label }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="优先级">
              <NTag :type="getPriorityTag(task.priority).type" size="small">
                {{ getPriorityTag(task.priority).label }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="状态">
              <NTag :type="getStatusTag(task.status).type" round>
                {{ getStatusTag(task.status).label }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="数据大小">
              {{ bitToMB(Number(task.dataSize)) }} MB
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- 处理进度卡片 -->
        <NCard title="处理进度" class="card-wrapper">
          <div class="space-y-4">
            <NProgress type="line" :percentage="getProgress()" :height="24" :border-radius="4" :fill-border-radius="0">
              <span class="text-white font-semibold">{{ getProgress() }}%</span>
            </NProgress>

            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <NStatistic label="数据总量" :value="bitToMB(Number(task.dataSize))">
                  <template #suffix>MB</template>
                </NStatistic>
              </div>
              <div class="text-center">
                <NStatistic label="已处理"
                  :value="bitToMB((task.metricsHistory && task.metricsHistory.length > 0) ? task.metricsHistory[task.metricsHistory.length - 1].cumulativeProcessed : 0)">
                  <template #suffix>MB</template>
                </NStatistic>
              </div>
              <div class="text-center">
                <NStatistic label="队列中"
                  :value="bitToMB((task.metricsHistory && task.metricsHistory.length > 0) ? task.metricsHistory[task.metricsHistory.length - 1].queuedData : 0)">
                  <template #suffix>MB</template>
                </NStatistic>
              </div>
            </div>
          </div>
        </NCard>

        <!-- 调度信息卡片 -->
        <NCard v-if="task.assignedCommId !== undefined && task.assignedCommId !== null" title="调度信息"
          class="card-wrapper">
          <NDescriptions :column="2" label-placement="left">
            <NDescriptionsItem label="分配节点ID">{{ task.assignedCommId }}</NDescriptionsItem>
            <NDescriptionsItem label="分配资源比例">
              {{ (task.metricsHistory && task.metricsHistory.length > 0) ?
                (task.metricsHistory[task.metricsHistory.length -
                  1].resourceFraction * 100).toFixed(2) : 0 }}%
            </NDescriptionsItem>
            <NDescriptionsItem label="调度时间">
              {{ task.scheduledTime ? dayjs(task.scheduledTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="开始时间">
              {{ task.startTime ? dayjs(task.startTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="完成时间">
              {{ task.completeTime ? dayjs(task.completeTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="传输路径" :span="2">
              <div v-if="task.transferPath && task.transferPath.length > 0">
                <span v-for="(node, idx) in task.transferPath" :key="idx">
                  节点 {{ node }}<span v-if="idx < task.transferPath.length - 1"> → </span>
                </span>
              </div>
              <div v-else>-</div>
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <!-- 传输路径可视化 -->
        <NCard v-if="task.transferPath && task.transferPath.length > 0" title="传输路径可视化" class="card-wrapper">
          <GraphData :transfer-path="task.transferPath" />
        </NCard>

        <!-- 性能指标卡片 -->
        <NCard v-if="task.metricsHistory && task.metricsHistory.length > 0" title="性能指标" class="card-wrapper">
          <div class="grid grid-cols-2 gap-6">
            <!-- 延迟指标 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">延迟指标</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">传输延迟</span>
                  <span class="text-xl font-bold text-blue-600">{{
                    (task.metricsHistory[task.metricsHistory.length - 1].transferDelay).toFixed(2) }} ms</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">计算延迟</span>
                  <span class="text-xl font-bold text-green-600">{{
                    (task.metricsHistory[task.metricsHistory.length - 1].computeDelay).toFixed(2) }} ms</span>
                </div>
                <div class="flex justify-between items-center border-t pt-3">
                  <span class="text-gray-800 font-semibold">总延迟</span>
                  <span class="text-2xl font-bold text-purple-600">{{
                    (task.metricsHistory[task.metricsHistory.length - 1].totalDelay).toFixed(2) }} ms</span>
                </div>
              </div>
            </div>

            <!-- 能耗指标 -->
            <div>
              <h3 class="text-lg font-semibold mb-4">能耗指标</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">传输能耗</span>
                  <span class="text-xl font-bold text-blue-600">{{
                    (task.metricsHistory[task.metricsHistory.length - 1].transferEnergy).toFixed(2) }} J</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">计算能耗</span>
                  <span class="text-xl font-bold text-green-600">{{
                    (task.metricsHistory[task.metricsHistory.length - 1].computeEnergy).toFixed(2) }} J</span>
                </div>
                <div class="flex justify-between items-center border-t pt-3">
                  <span class="text-gray-800 font-semibold">总能耗</span>
                  <span class="text-2xl font-bold text-purple-600">{{
                    (task.metricsHistory[task.metricsHistory.length - 1].totalEnergy).toFixed(2) }} J</span>
                </div>
              </div>
            </div>
          </div>
        </NCard>

        <!-- 任务处理进度图表 -->
        <NCard v-if="task.metricsHistory && task.metricsHistory.length > 0" title="任务处理进度" class="card-wrapper">
          <ProgressChart :metrics-history="task.metricsHistory" />
        </NCard>

        <!-- 时延趋势图表 -->
        <NCard v-if="task.metricsHistory && task.metricsHistory.length > 0" title="时延趋势" class="card-wrapper">
          <DelayChart :metrics-history="task.metricsHistory" />
        </NCard>

        <!-- 能耗趋势图表 -->
        <NCard v-if="task.metricsHistory && task.metricsHistory.length > 0" title="能耗趋势" class="card-wrapper">
          <EnergyChart :metrics-history="task.metricsHistory" />
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<style scoped>
.p-4 {
  padding: 1rem;
}

.space-y-4>*+* {
  margin-top: 1rem;
}

.space-y-3>*+* {
  margin-top: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.text-center {
  text-align: center;
}

.border-t {
  border-top: 1px solid #e5e7eb;
}

.pt-3 {
  padding-top: 0.75rem;
}
</style>
