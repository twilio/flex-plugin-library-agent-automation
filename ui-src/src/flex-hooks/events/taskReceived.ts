import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import { TaskQualificationConfig } from '../../types/ServiceConfiguration';

import { getMatchingTaskConfiguration } from '../../utils/config';

async function selectAndAcceptTask(task: ITask, taskConfig: TaskQualificationConfig) {
  const {
    sid,
    attributes: { direction },
    taskChannelUniqueName,
  } = task;

  // we don't want to auto accept outbound voice tasks as they are already auto
  // accepted
  if (taskChannelUniqueName === 'voice' && direction === 'outbound') return;

  // Select and accept the task per configuration
  if (taskConfig.auto_select) await Flex.Actions.invokeAction('SelectTask', { sid });
  if (taskConfig.auto_accept) await Flex.Actions.invokeAction('AcceptTask', { sid });
}

export const taskReceivedListenerHook = function (flex: typeof Flex, manager: Flex.Manager) {
  manager.events.addListener('taskReceived', (task: ITask) => {
    const taskConfig = getMatchingTaskConfiguration(task);
    if (taskConfig) selectAndAcceptTask(task, taskConfig);
  });
};
