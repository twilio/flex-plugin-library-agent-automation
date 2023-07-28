import { ITask } from '@twilio/flex-ui';

import { TaskQualificationConfig } from '../types/ServiceConfiguration';

interface TaskAttributesQualificationConfig {
  key: string;
  value: string;
}

const configuration = [
  {
    channel: 'voice',
    auto_accept: true,
    auto_select: false,
    auto_wrapup: true,
    required_attributes: [],
    wrapup_time: 5000,
    default_outcome: '',
  },
  {
    channel: 'chat',
    auto_accept: false,
    auto_select: false,
    auto_wrapup: false,
    required_attributes: [],
    wrapup_time: 30000,
    default_outcome: '',
  },
];

export const getMatchingTaskConfiguration = (task: ITask): TaskQualificationConfig | null => {
  const { taskChannelUniqueName: channel } = task;
  const attributes = task.attributes as any;
  let first_matched_config = null as TaskQualificationConfig | null;

  configuration.forEach((config) => {
    let matched_config = true;
    if (config.channel === channel) {
      config.required_attributes?.forEach((required_attribute: TaskAttributesQualificationConfig) => {
        if (attributes[required_attribute.key] !== required_attribute.value) {
          matched_config = false;
        }
      });
      if (matched_config && !first_matched_config) {
        first_matched_config = config;
      }
    }
  });

  return first_matched_config;
};
