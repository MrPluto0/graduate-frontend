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
    interface UserTask {
      userId: number;
      name: string;
      type: string;
      dataSize: any;
      priority: number;
      status: string;
      createdAt: string;
    }

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
