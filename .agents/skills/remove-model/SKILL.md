---
name: remove-model
description: Prompt the user to input a model name to remove, then remove this model and all its related froms and templates from the project
---

{$input:model_name}

Find the model class located in the folder /main/models. Then, remove the model class file.
After removing the model class, remove the forms located in the folder /main/forms.
Remove the templates located in the folder /main/templates/staff_session_parameters that reference the model.
Remove references to model in the folder /main/templates/subject/subject_home/the_stage
Remove references to model in the folder /main/consumers/staff/session_consumer_mixins/subject_updates.py
Remove references to model in the folder /main/consumers/staff/session_parameters_consumer_mixins
Remove references to model in the folder /main/consumers/subject/subject_home_consumer_mixins/interface.py
Remove references to model in the folder /main/templates/staff/staff_session_parameters/general_settings/take_update_parameter_set.js