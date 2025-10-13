import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormSection, FormRow, FormActions, Button, H3, Text } from '../../ui/primitives';
import { InputField, TextareaField, SelectDropdown, CheckboxField } from './';

/**
 * ContactForm - Contact form demonstrating Form primitive usage
 *
 * Before: <form onSubmit={handleSubmit}>
 * After: <Form onSubmit={handleSubmit} $gap={4}>
 */
export const ContactForm = ({ onSubmit, loading = false, errors = {} }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'partnership', label: 'Partnership' },
  ];

  return (
    <Form onSubmit={handleSubmit} $gap={5} $maxWidth="600px">
      {/* Header */}
      <FormSection $gap={2}>
        <H3>Get in Touch</H3>
        <Text $color="secondary">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Text>
      </FormSection>

      {/* Personal Information */}
      <FormSection $gap={4}>
        <FormRow $gap={4} $stackOnMobile $equalWidth>
          <InputField
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            placeholder="John"
          />

          <InputField
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            placeholder="Doe"
          />
        </FormRow>

        <FormRow $gap={4} $stackOnMobile $equalWidth>
          <InputField
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            placeholder="john.doe@example.com"
          />

          <InputField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="+1 (555) 123-4567"
          />
        </FormRow>
      </FormSection>

      {/* Message Details */}
      <FormSection $gap={4}>
        <SelectDropdown
          label="Subject"
          required
          options={subjectOptions}
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          error={errors.subject}
          placeholder="What is this regarding?"
        />

        <TextareaField
          label="Message"
          required
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          error={errors.message}
          placeholder="Tell us more about your inquiry..."
          rows={5}
        />
      </FormSection>

      {/* Newsletter Signup */}
      <FormSection>
        <CheckboxField
          label="Subscribe to our newsletter"
          description="Get updates about new features and company news."
          checked={formData.newsletter}
          onChange={(e) => handleChange('newsletter', e.target.checked)}
        />
      </FormSection>

      {/* Actions */}
      <FormActions $justify="flex-end" $gap={3}>
        <Button type="button" $variant="ghost" disabled={loading}>
          Clear Form
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </FormActions>
    </Form>
  );
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};
