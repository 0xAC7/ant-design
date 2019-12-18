import * as React from 'react';
import classNames from 'classnames';
import Col, { ColProps } from '../grid/col';
import { FormLabelAlign } from './interface';
import { FormContext, FormContextProps } from './context';

import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';

export interface FormItemLabelProps {
  colon?: boolean;
  htmlFor?: string;
  label?: React.ReactNode;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
}

const FormItemLabel: React.FC<FormItemLabelProps & { required: boolean; prefixCls: string }> = ({
  prefixCls,
  label,
  htmlFor,
  labelCol,
  labelAlign,
  colon,
  required,
}) => {
  if (!label) return null;
  console.log(label, required);
  const formContext = React.useContext(FormContext);
  const { hideRequiredMark } = formContext;

  return (
    <FormContext.Consumer key="label">
      {({
        vertical,
        labelAlign: contextLabelAlign,
        labelCol: contextLabelCol,
        colon: contextColon,
      }: FormContextProps) => {
        const mergedLabelCol: ColProps = labelCol || contextLabelCol || {};

        const mergedLabelAlign: FormLabelAlign | undefined = labelAlign || contextLabelAlign;

        const labelClsBasic = `${prefixCls}-item-label`;
        const labelColClassName = classNames(
          labelClsBasic,
          mergedLabelAlign === 'left' && `${labelClsBasic}-left`,
          mergedLabelCol.className,
        );

        let labelChildren = label;
        // Keep label is original where there should have no colon
        const computedColon = colon === true || (contextColon !== false && colon !== false);
        const haveColon = computedColon && !vertical;
        // Remove duplicated user input colon
        if (haveColon && typeof label === 'string' && (label as string).trim() !== '') {
          labelChildren = (label as string).replace(/[：|:]\s*$/, '');
        }

        const labelClassName = classNames({
          [`${prefixCls}-item-required`]: required,
          [`${prefixCls}-item-no-colon`]: !computedColon,
        });

        return (
          <Col {...mergedLabelCol} className={labelColClassName}>
            <label
              htmlFor={htmlFor}
              className={labelClassName}
              title={typeof label === 'string' ? label : ''}
            >
              {labelChildren}
              {typeof hideRequiredMark === 'object' && !required && hideRequiredMark.optionalMark && (
                <LocaleReceiver componentName="Form" defaultLocale={defaultLocale.Form}>
                  {(locale: { optionalText: string }) => (
                    <span className={`${labelClsBasic}-tag`}>{locale.optionalText}</span>
                  )}
                </LocaleReceiver>
              )}
            </label>
          </Col>
        );
      }}
    </FormContext.Consumer>
  );
};

export default FormItemLabel;
