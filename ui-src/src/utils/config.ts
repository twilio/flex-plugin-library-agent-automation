import { ITask } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';
import { TaskQualificationConfig } from '../types/ServiceConfiguration';

interface TaskAttributesQualificationConfig {
  key: string;
  value: string;
}

type FlexUIAttributes = Flex.ServiceConfiguration['ui_attributes'];

interface UIAttributes extends FlexUIAttributes {
  agent_automation: {
    configuration: any;
  };
}

const configuration = Flex?.Manager?.getInstance()?.configuration as UIAttributes;

export const getMatchingTaskConfiguration = (task: ITask): TaskQualificationConfig | null => {
  const { taskChannelUniqueName: channel } = task;
  const attributes = task.attributes as any;
  let first_matched_config = null as TaskQualificationConfig | null;

  configuration.agent_automation.configuration.forEach((config: any) => {
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
