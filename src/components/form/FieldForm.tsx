import React from "react";
import { Form, Input, Select, Switch, Checkbox, DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { number } from "zod";

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export type OptionType = {
  label: string;
  value: string | number | boolean;
};

export type FieldFormProps = {
  type?:
    | "input"
    | "textarea"
    | "select"
    | "switch"
    | "checkbox"
    | "date"
    | "rangeDate"
    | 'hidden';
  inputType?: string;
  name: string;
  label: string;
  required?: boolean;
  rules?: any[]; // thêm rule
  placeholder?: string;
  options?: OptionType[];
  valuePropName?: string;
  showSearch?: boolean; 
  mode?: "multiple" | "tags";
  disabled?: boolean;
  format?: string; // cho date
  picker?: RangePickerProps["picker"];
  [key: string]: any; // thêm các thuộc tính khác như maxLength, onChange, inputType,...
};

const FieldForm: React.FC<FieldFormProps> = ({
  type = "input",
  inputType = 'text',
  name,
  label,
  required = false,
  rules = [],
  placeholder = "",
  options = [],
  valuePropName,
  showSearch = false,
  mode,
  disabled = false,
  format = "YYYY-MM-DD",
  picker,
  ...rest
}) => {
  const baseRules = required
    ? [
        {
          required: true,
          message: `Vui lòng nhập ${label.charAt(0).toLowerCase()}${label.slice(
            1
          )}`,
        },
        ...rules,
      ]
    : rules;
  // Trường hợp hidden
  if (type === 'hidden') {
    return (
      <Form.Item name={name} hidden>
        <Input type="hidden" {...rest} />
      </Form.Item>
    );
  }
  let inputElement: React.ReactNode;

  switch (type) {
    case 'textarea':
      inputElement = (
        <TextArea placeholder={placeholder} disabled={disabled} {...rest} />
      );
      break;
    case 'select':
      inputElement = (
        <Select
          placeholder={placeholder}
          showSearch={showSearch}
          mode={mode}
          disabled={disabled}
          {...rest}
        >
          {options.map((opt) => (
            <Option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );
      break;
    case 'switch':
      inputElement = <Switch disabled={disabled} {...rest} />;
      break;
    case 'checkbox':
      if (options.length > 0) {
        inputElement = (
          <Checkbox.Group
            options={options.map((opt) => ({
              label: opt.label,
              value: opt.value,
            }))}
            disabled={disabled}
            {...rest}
          />
        );
      } else {
        inputElement = (
          <Checkbox disabled={disabled} {...rest}>
            {placeholder || label}
          </Checkbox>
        );
      }
      break;
    case 'date':
      inputElement = (
        <DatePicker
          placeholder={placeholder}
          format={format}
          disabled={disabled}
          {...rest}
        />
      );
      break;
    case 'rangeDate':
      inputElement = (
        <RangePicker
          format={format}
          placeholder={['Từ ngày', 'Đến ngày']}
          picker={picker}
          disabled={disabled}
          {...rest}
        />
      );
      break;
    default:
      inputElement = (
        <Input
          type={inputType || 'text'}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
        />
      );
  }

  return (
    <Form.Item
      required={false}
      label={
        type !== 'checkbox' || options.length > 0 ? (
          <span className="text-sm font-medium text-gray-700 mb-1" >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        ) : undefined
      }
      name={name}
      rules={baseRules}
      valuePropName={
        type === 'switch' || (type === 'checkbox' && options.length === 0)
          ? 'checked'
          : valuePropName
      }
    >
      {inputElement}
    </Form.Item>
  );
};

export default FieldForm;
