import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormSection,
  FormRow,
  FormActions,
  Button,
  H3,
  Text,
  Divider,
} from '../../ui/primitives';
import {
  InputField,
  TextareaField,
  SelectDropdown,
  CheckboxField,
  RadioGroup,
  SwitchToggle,
  DatePickerField,
} from './';

/**
 * ExampleForm - A comprehensive example showing Form primitive usage
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Form submit handler
 * @param {Object} props.initialData - Initial form data
 * @param {boolean} props.loading - Whether form is submitting
 * @param {Object} props.errors - Form validation errors
 */
export const ExampleForm = ({ onSubmit, initialData = {}, loading = false, errors = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    category: '',
    priority: 'medium',
    notifications: true,
    deadline: '',
    terms: false,
    ...initialData,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const categoryOptions = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'support', label: 'Support' },
    { value: 'other', label: 'Other' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'Non-urgent issue' },
    { value: 'medium', label: 'Medium', description: 'Standard priority' },
    { value: 'high', label: 'High', description: 'Urgent issue' },
  ];

  return (
    <Form
      onSubmit={handleSubmit}
      $gap={6}
      $maxWidth="600px"
      $p={6}
      $bg="surface"
      $radius="lg"
      $shadow="md"
    >
      {/* Form Header */}
      <FormSection $gap={2} $mb={4}>
        <H3>Create New Ticket</H3>
        <Text $color="secondary">Fill out the form below to create a new support ticket.</Text>
        <Divider />
      </FormSection>

      {/* Basic Information Section */}
      <FormSection $gap={4}>
        <H3 $fontSize="lg">Basic Information</H3>

        <FormRow $gap={4} $stackOnMobile $equalWidth>
          <InputField
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter your full name"
          />

          <InputField
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            placeholder="your.email@example.com"
          />
        </FormRow>

        <SelectDropdown
          label="Category"
          required
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          error={errors.category}
          placeholder="Select a category"
        />

        <TextareaField
          label="Description"
          required
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          placeholder="Describe your issue in detail..."
          rows={4}
        />
      </FormSection>

      {/* Priority and Settings Section */}
      <FormSection $gap={4} $border $radius="md" $p={4} $bg="subtle">
        <H3 $fontSize="lg">Priority & Settings</H3>

        <RadioGroup
          label="Priority Level"
          options={priorityOptions}
          value={formData.priority}
          onChange={(value) => handleChange('priority', value)}
          error={errors.priority}
        />

        <FormRow $gap={6} $stackOnMobile>
          <DatePickerField
            label="Deadline (Optional)"
            value={formData.deadline}
            onChange={(value) => handleChange('deadline', value)}
            error={errors.deadline}
          />

          <SwitchToggle
            label="Email Notifications"
            description="Receive updates via email"
            checked={formData.notifications}
            onChange={(e) => handleChange('notifications', e.target.checked)}
          />
        </FormRow>
      </FormSection>

      {/* Terms and Conditions */}
      <FormSection $gap={3}>
        <CheckboxField
          label="I agree to the terms and conditions"
          description="By submitting this form, you agree to our privacy policy and terms of service."
          checked={formData.terms}
          onChange={(e) => handleChange('terms', e.target.checked)}
          error={errors.terms}
        />
      </FormSection>

      {/* Form Actions */}
      <FormActions $divider $justify="space-between" $stackOnMobile>
        <Button type="button" $variant="ghost" disabled={loading}>
          Save as Draft
        </Button>

        <FormRow $gap={3}>
          <Button type="button" $variant="ghost" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !formData.terms}>
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </FormRow>
      </FormActions>
    </Form>
  );
};

ExampleForm.propTypes = {
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};
