/** 认证表单字段的校验配置。 */
export interface AuthFormField {
  key: 'username' | 'password'
  label: string
  placeholder: string
  rules: {
    required: boolean
    pattern?: RegExp
    min?: number
    max?: number
    message: string
  }[]
}

/** 密码格式：长度 8-128 且同时包含字母和数字，与后端校验保持一致。 */
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*\d).+$/i;

/** 登录与注册共用的表单字段配置。 */
export const formFields: AuthFormField[] = [
  {
    key: 'username',
    label: '用户名',
    placeholder: '3-64位，字母数字下划线',
    rules: [
      { required: true, message: '请输入用户名' },
      { required: true, min: 3, max: 64, pattern: /^\w+$/, message: '3-64位，仅字母数字下划线' },
    ],
  },
  {
    key: 'password',
    label: '密码',
    placeholder: '8-128位，字母+数字',
    rules: [
      { required: true, message: '请输入密码' },
      { required: true, min: 8, max: 128, pattern: PASSWORD_PATTERN, message: '8-128位，必须包含字母和数字' },
    ],
  },
];

/** 校验单个字段，返回首条错误信息。 */
export function validateField(key: 'username' | 'password', value: string): string | null {
  const field = formFields.find(f => f.key === key);
  if (!field) {
    return null;
  }

  for (const rule of field.rules) {
    if (rule.required && !value) {
      return rule.message;
    }
    if (rule.min && value.length < rule.min) {
      return rule.message;
    }
    if (rule.max && value.length > rule.max) {
      return rule.message;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }
  }

  return null;
}

/** 校验表单所有字段，返回字段名到错误信息的映射。 */
export function validateForm(model: { username: string, password: string }): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of formFields) {
    const error = validateField(field.key, model[field.key]);
    if (error) {
      errors[field.key] = error;
    }
  }

  return errors;
}
