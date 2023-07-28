import ApiService from './ApiService';
import { EncodedParams } from '../types/Params';
import { ErrorManager, FlexPluginErrorType } from '../utils/ErrorManager';
import { TaskAssignmentStatus } from '../types/task-router/Task';
import { merge } from 'lodash';
import { TaskHelper } from '@twilio/flex-ui';

export interface Queue {
  targetWorkers: string;
  friendlyName: string;
  sid: string;
}

interface UpdateTaskAttributesResponse {
  success: boolean;
}

interface GetQueuesResponse {
  success: boolean;
  queues: Array<Queue>;
}

interface GetWorkerChannelsResponse {
  success: boolean;
  workerChannels: Array<WorkerChannelCapacityResponse>;
}

export interface WorkerChannelCapacityResponse {
  accountSid: string;
  assignedTasks: number;
  available: boolean;
  availableCapacityPercentage: number;
  configuredCapacity: number;
  dateCreated: string;
  dateUpdated: string;
  sid: string;
  taskChannelSid: string;
  taskChannelUniqueName: string;
  workerSid: string;
  workspaceSid: string;
  url: string;
}
interface UpdateWorkerChannelResponse {
  success: boolean;
  message?: string;
  workerChannelCapacity: WorkerChannelCapacityResponse;
}

const queues = null as null | Array<Queue>;

class TaskRouterService extends ApiService {
  private instanceSid = this.manager.serviceConfiguration.flex_service_instance_sid;

  private STORAGE_KEY = `pending_task_updates_${this.instanceSid}`;

  addToLocalStorage(taskSid: string, attributesUpdate: object): void {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (!storageObject[taskSid]) {
      storageObject[taskSid] = {};
    }

    storageObject[taskSid] = merge({}, storageObject[taskSid], attributesUpdate);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageObject));
  }

  fetchFromLocalStorage(taskSid: string): any {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (!storageObject[taskSid]) {
      storageObject[taskSid] = {};
    }

    return storageObject[taskSid];
  }

  removeFromLocalStorage(taskSid: string): void {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };
    let changed = false;

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (storageObject[taskSid]) {
      delete storageObject[taskSid];
      changed = true;
    }

    // Janitor - clean up any tasks that we don't have
    for (const [key] of Object.entries(storageObject)) {
      if (!TaskHelper.getTaskByTaskSid(key)) {
        delete storageObject[key];
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageObject));
    }
  }

  async updateTaskAttributes(taskSid: string, attributesUpdate: object, deferUpdates = false): Promise<boolean> {
    if (deferUpdates) {
      // Defer update; merge new attrs into local storage
      this.addToLocalStorage(taskSid, attributesUpdate);
      return true;
    }

    // Fetch attrs from local storage and merge into the provided attrs
    const mergedAttributesUpdate = merge({}, this.fetchFromLocalStorage(taskSid), attributesUpdate);
    if (Object.keys(mergedAttributesUpdate).length < 1) {
      // No attributes provided to update
      return true;
    }

    const result = await this.#updateTaskAttributes(taskSid, JSON.stringify(mergedAttributesUpdate));

    if (result.success) {
      // we've pushed updates; remove pending attributes
      this.removeFromLocalStorage(taskSid);
    }

    return result.success;
  }

  #updateTaskAttributes = async (taskSid: string, attributesUpdate: string): Promise<UpdateTaskAttributesResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      taskSid: encodeURIComponent(taskSid),
      attributesUpdate: encodeURIComponent(attributesUpdate),
    };

    return this.fetchJsonWithReject<UpdateTaskAttributesResponse>(
      // `https://${this.serverlessDomain}/agentAtuomation/update-task-attributes`,
      `https://4bb9-2405-201-d00b-18e1-655c-923d-2055-caca.ngrok-free.app/agentAtuomation/update-task-attributes`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): UpdateTaskAttributesResponse => {
      return {
        ...response,
      };
    });
  };
}

export default new TaskRouterService();
