import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormActions, Button, H2, Text } from '../../ui/primitives';
import { InputField, CheckboxField } from './';

/**
 * LoginForm - A simple login form using Form primitive
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Form submit handler
 * @param {boolean} props.loading - Whether form is submitting
 * @param {Object} props.errors - Form validation errors
 * @param {boolean} props.showRememberMe - Whether to show remember me checkbox
 */
export const LoginForm = ({ onSubmit, loading = false, errors = {}, showRememberMe = true }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Form
      onSubmit={handleSubmit}
      $gap={5}
      $maxWidth="400px"
      $p={8}
      $bg="surface"
      $radius="xl"
      $shadow="lg"
      $mx="auto"
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <H2>Welcome Back</H2>
        <Text $color="secondary" $mt={2}>
          Sign in to your account
        </Text>
      </div>

      {/* Form Fields */}
      <InputField
        label="Email Address"
        type="email"
        required
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        placeholder="your.email@example.com"
        autoComplete="email"
      />

      <InputField
        label="Password"
        type="password"
        required
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
        placeholder="Enter your password"
        autoComplete="current-password"
      />

      {showRememberMe && (
        <CheckboxField
          label="Remember me"
          checked={formData.rememberMe}
          onChange={(e) => handleChange('rememberMe', e.target.checked)}
        />
      )}

      {/* Actions */}
      <FormActions $justify="stretch" $pt={2}>
        <Button
          type="submit"
          disabled={loading || !formData.email || !formData.password}
          style={{ width: '100%' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </FormActions>

      {/* Footer Links */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Text $fontSize="sm" $color="secondary">
          Don't have an account?{' '}
          <Button $variant="ghost" $size="sm" style={{ padding: 0, height: 'auto' }}>
            Sign up
          </Button>
        </Text>
      </div>
    </Form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  errors: PropTypes.object,
  showRememberMe: PropTypes.bool,
};
