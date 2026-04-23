---
name: add-model-form-consumer-template
description: 'Create a Django feature slice with a new model, form, Channels consumer, and template. Use when adding a socket-backed workflow that needs persistence, validation, realtime updates, and UI updates.'
---

# Add a new Model with associated Form, Consumer, and Template.

## Procedure
1. Discover local patterns first.
- Inspect the similar existing files, `main/models/parameter_set_ground.py`, `main/forms/parameter_set_ground_form.py`, `main/consumers/staff/session_parameters_consumer_mixins/parameter_set_grounds.py`, and the files in `main/templates/staff/staff_session_parameters/grounds`.
- Reuse conventions already established in these files for model fields, form structure, consumer event handling, and template organization.

2. Create a new the model .
- Create a model in `main/models/` with appropriate fields and relationships
- Follow existing patterns for field types, verbose names, and string representations.

4. Create the form.
- Create a form in `main/forms/` that corresponds to the new model.
- Implement validation logic in the form's `clean` methods as needed.
- Follow existing patterns for form field definitions and error handling.

5. Implement the consumer.
- Create a Channels consumer in `main/consumers/` that handles websocket connections for the new feature.
- Implement event handlers for the consumer that correspond to the expected client interactions.
- Follow existing patterns for authentication, group management, and event naming.

7. Implement the template.
- Create a template in `main/templates/staff/staff_session_parameters/` that provides the UI for the new feature.
- Use existing templates as a reference for structure, styling, and how data is passed from the

## Example Prompts
- `/add-model-form-consumer-template Build a live notice board with Notice model, NoticeForm, NoticeConsumer, and a staff template.`
- `/add-model-form-consumer-template Add a realtime queue feature with QueueItem model and websocket updates to the dashboard.`
- `/add-model-form-consumer-template Create a moderation request workflow with validation, socket approvals, and a review page.`
