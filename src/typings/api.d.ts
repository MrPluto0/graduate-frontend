/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      accessToken: string;
      refreshToken: string;
    }

    interface UserInfo {
      userId: string;
      username: string;
      roles: string[];
      buttons: string[];
    }
  }

  namespace Alg {
    interface TaskMetrics {
      transferDelay: number;
      computeDelay: number;
      totalDelay: number;
      transferEnergy: number;
      computeEnergy: number;
      totalEnergy: number;
    }

    interface SlotMetrics {
      timeSlot: number; // 时隙编号
      transferredData: number; // 本时隙传输的数据量
      processedData: number; // 本时隙处理的数据量
      queuedData: number; // 本时隙结束时的队列数据量
      cumulativeProcessed: number; // 累计已处理数据量
      resourceFraction: number; // 分配的资源比例
      transferDelay: number; // 传输延迟
      computeDelay: number; // 计算延迟
      totalDelay: number; // 总延迟
      transferEnergy: number; // 传输能耗
      computeEnergy: number; // 计算能耗
      totalEnergy: number; // 总能耗
    }

    interface TransferPath {
      path: number[]; // 设备ID路径
      speeds: number[]; // 每段的传输速率
      powers: number[]; // 每段的传输功率
    }

    interface Task {
      id: number;
      userId: number;
      name: string;
      type: string;
      dataSize: number;
      priority: number;
      status: number; // 后端使用整数表示状态
      createdAt: string;

      // 调度结果
      assignedCommId?: number; // AssignedCommID
      transferPath?: TransferPath | null; // 传输路径

      // 时间
      scheduledTime?: string; // 调度时间
      completeTime?: string; // 完成时间

      // 性能指标历史
      metricsHistory?: SlotMetrics[]; // 每个时隙的执行历史
    }

    // 兼容：如果代码仍在使用 UserTask 名称，提供别名
    type UserTask = Task;

    interface AlgStatus {
      userCount: number;
      commCount: number;
      isRunning: boolean;
      isInitialized: boolean;
      timeSlot: number;
      transferPath: Record<string, number[]>;
      taskCount: number;
      activeTasks: number;
      completedTasks: number;
      state: {
        commQueues: Record<string, number>;
        totalQueue: number;
        transferDelay: number;
        computeDelay: number;
        totalDelay: number;
        transferEnergy: number;
        computeEnergy: number;
        totalEnergy: number;
        load: number;
        cost: number;
        drift: number;
        penalty: number;
      };
    }
  }

  /**
   * namespace Alarm
   *
   * backend api module: "alarm"
   */
  namespace Alarm {
    interface Alarm {
      id: number;
      name: string;
      eventType: string;
      status: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      resolvedAt?: string;
    }

    type AlarmListResponse = Common.PaginatingQueryRecord<Alarm>;
  }

  /**
   * namespace Monitor
   *
   * backend api module: "monitor"
   */
  namespace Monitor {
    interface SystemMetrics {
      timestamp: string;
      cpuUsage: number;
      memTotal: number;
      memUsed: number;
      memFree: number;
      memUsageRate: number;
      goroutineCount: number;
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }
}
