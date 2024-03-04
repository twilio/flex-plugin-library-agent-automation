## Details
#### How it works
- Plugin is ready to use once it is installed and the browser window is refreshed.
- This plugin listens for taskReceived events and evaluates whether the tasks matches any configuration sets (as outlined in the Installation section below) and if so executes SelectTask & AcceptTask action as configured. This feature also loads a renderless component on the task canvas at wrap up. When the component mounts, if there is a matching task configuration then a timeout is set per the task configuration that triggers a CompleteTask action.

#### Installation
The following default configuration can be modified as per requirements:
```json

{
    "configuration": [
        {
            "channel": "voice",
            "required_attributes": [{"key": "direction", "value": "inbound"}],
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
 
```
- Configuration properties:
	- `configuration`  - an array of objects containing channel specific configurations
	- `channel`  - this is the task router channel
	- `required_attributes`  - these are key value pairs of attribute values that need to be present on the task to qualify for the configuration set
	- `auto_accept`  - set this to true if you want the task to be auto accepted else set it to false
	- `auto_select`  - set this to true if you want the task to be auto selected else set it to false
	- `auto_wrapup`  - set this to true if you want the task to be auto completed after wrapup else set it to false
  - `wrapup_time`  - time in milliseconds to be waited after task is wrapped up to trigger auto completion of the task
  - `default_outcome`  - When this plugin is used in combination with the dispositions plugin's `require_disposition` setting, that setting will take precedence and prevent auto-wrap-up of the affected task if no disposition is selected. If no disposition is required, the optional default_outcome setting allows you to configure the value displayed in Flex Insights for the outcome when the wrapup time expires and there is no disposition selected by the agent via the dispositions feature (or it is disabled).