import * as Flex from '@twilio/flex-ui';

import AutoWrap from '../../components/AutoComplete';

export const addAutoWrapToTaskCanvasHeader = function addAutoWrap(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasHeader.Content.add(<AutoWrap key="auto-wrap" />, {
    sortOrder: -1,
    if: (props) => props.task.status === 'wrapping',
  });
};
