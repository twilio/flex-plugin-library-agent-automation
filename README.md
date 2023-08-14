#### How it works

Plugin is ready to use once it is installed and the configurations are defined in flex config (see Installation steps below) and the browser window is refreshed.

- This feature provides auto select, auto accept and auto wrap up behavior for agent tasks.
- Tasks qualify for a configuration set based on their channel and a set of required task attributes.
- The first configuration set to match is the configuration set used.

#### Installation

- After installing the plugin, the settings for this plugin are to be set in flex config. Refer [Flex Configuration REST API](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api) docs.
- Sample payload for setting the configuration in flex config:

```json
{
  "account_sid": "ACXXXXXXXXXXXXXXXXX",
  "ui_attributes": {
    "agent_automation": {
      "configuration": [
        {
          "channel": "voice",
          "required_attributes": [{ "key": "direction", "value": "inbound" }],
          "auto_accept": true,
          "auto_select": true,
          "auto_wrapup": true,
          "wrapup_time": 5000,
          "default_outcome": "Automatically completed"
        },
        {
          "channel": "chat",
          "auto_accept": true,
          "auto_select": true,
          "auto_wrapup": true,
          "required_attributes": [],
          "wrapup_time": 5000,
          "default_outcome": "Automatically completed"
        }
      ]
    }
  }
}
```

- Configuration properties:
  - `configuration` - an array of objects containing channel specific configurations
  - `channel` - this is the task router channel
  - `required_attributes` - these are key value pairs of attribute values that need to be present on the task to qualify for the configuration set
  - `auto_accept` - set this to true if you want the task to be auto accepted else set it to false
  - `auto_select` - set this to true if you want the task to be auto selected else set it to false
  - `auto_wrapup` - set this to true if you want the task to be auto completed after wrapup else set it to false
  - `wrapup_time` - time in milliseconds to be waited after task is wrapped up to trigger auto completion of the task
  - `default_outcome` - When this plugin is used in combination with the dispositions plugin's `require_disposition` setting, that setting will take precedence and prevent auto-wrap-up of the affected task if no disposition is selected. If no disposition is required, the optional default_outcome setting allows you to configure the value displayed in Flex Insights for the outcome when the wrapup time expires and there is no disposition selected by the agent via the dispositions feature (or it is disabled).

### Overview

When enabled, this feature listens for taskReceived events and evaluates whether the tasks matches any configuration sets and if so executes SelectTask & AcceptTask action as configured. This feature also loads a renderless component on the task canvas at wrapup. When the component mounts, if there is a matching task configuration then a timeout is set per the task configuration that triggers a CompleteTask action.
