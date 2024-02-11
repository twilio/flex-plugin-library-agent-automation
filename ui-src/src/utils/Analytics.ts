import FlexTelemetry from '@twilio/flex-ui-telemetry';
import packageJSON from '../../package.json';

export enum Event {
  TASK_AUTO_SELECTED = 'AAuto Task Auto Selected',
  TASK_AUTO_ACCEPTED = 'AAuto Task Auto Accepted',
  TASK_AUTO_WRAPPED = 'AAuto Task Auto Wrapped',
}

export const Analytics = new FlexTelemetry({
  source: 'flexui',
  role: packageJSON.name,
  plugin: packageJSON.name,
  pluginVersion: packageJSON.version,
  originalPluginName: packageJSON.id,
});