---
name: add-model-field
description: Prompt the user to input a new field name and value, then add this field to the specified model in the database.

---

{$input:model_name}
{$input:field_name}
{$input:field_type}

Find the model class located in the folder /main/models. Then, add the new field to the model class with the specified field name and field type.
After adding the field to the model class, update the its form located in the folder /main/forms to include the new field.
After updating the form, template located in the folder /main/templates/staff_session_parameters to include the new field.