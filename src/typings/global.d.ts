export {};

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import('nprogress').NProgress;
    /** Loading bar instance */
    $loadingBar?: import('naive-ui').LoadingBarProviderInst;
    /** Dialog instance */
    $dialog?: import('naive-ui').DialogProviderInst;
    /** Message instance */
    $message?: import('naive-ui').MessageProviderInst;
    /** Notification instance */
    $notification?: import('naive-ui').NotificationProviderInst;
  }

  /** Build time of the project */
  export const BUILD_TIME: string;

  /** Version of the project */
  export interface User {
    /** Device ID */
    id: number;
    /** Creation time */
    createdAt: string;
    /** Update time */
    updatedAt: string;
    /** Deletion time */
    deletedAt?: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
  }

  /** Interface for device information */
  export interface Device {
    /** Device ID */
    id: number;
    /** Creation time */
    createdAt: string;
    /** Update time */
    updatedAt: string;
    /** Deletion time */
    deletedAt?: string;
    /** Device name */
    name: string;
    /** Device type */
    deviceType: string;
    /** MAC address */
    mac: string;
    /** IP address */
    ip: string;
    /** Device status */
    status: string;
    /** Device vendor */
    vendor: string;
    /** Device version */
    version: string;
    /** Device location */
    location: string;
    /** Device description */
    description: string;
    /** Device configuration (JSON format) */
    configJson?: string;
    /** Device metadata (JSON format) */
    metaData?: string;
    /** Associated user ID */
    userId?: number;
  }

  /** Interface for topology node */
  export interface Node {
    /** Node ID */
    id: number;
    /** Creation time */
    createdAt: string;
    /** Update time */
    updatedAt: string;
    /** Deletion time */
    deletedAt?: string;
    /** Node name */
    name: string;
    /** Node position coordinates [x, y] */
    x: number;
    y: number;
    /** Node properties (JSON format) */
    properties?: string;
    /** Associated device ID */
    deviceId?: number;
    /** Associated device */
    device?: Device;
    /** Node description */
    description: string;
    cpu?: number | string;
    mem?: number | string;
    disk?: number | string;
  }

  /** Interface for topology link */
  export interface Link {
    /** Link ID */
    id: number;
    /** Creation time */
    createdAt: string;
    /** Update time */
    updatedAt: string;
    /** Deletion time */
    deletedAt?: string;
    /** Link name */
    name: string;
    /** Link status */
    status: string;
    /** Source node ID */
    sourceId: number;
    /** Source node */
    source?: Node;
    /** Target node ID */
    targetId: number;
    /** Target node */
    target?: Node;
    /** Link properties (JSON format) */
    properties?: string;
    /** Link description */
    description: string;
    bandwidth?: number | string;
    delay?: number | string;
  }

  export interface AlarmEvent {
    /** Event ID */
    id: number;
    /** Creation time */
    createdAt: string;
    /** Update time */
    updatedAt: string;
    /** Deletion time */
    deletedAt?: string;
    /** Event name */
    name: string;
    /** Event type */
    eventType: string;
    /** Event status */
    status: string;
    description?: string;
    /** Associated device ID */
    deviceId?: number;
    /** Associated device */
    device?: Device;
  }
}
