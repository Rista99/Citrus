import { FormDependencyType } from '@/types';
import React, { cloneElement, ReactElement, ReactNode, useMemo } from 'react';
import { Control, Controller, UseFormReturn, useWatch } from 'react-hook-form';

const DependencyWrapper: React.FC<{
  children: ReactElement<any>;
  control: Control;
  dependencies: Array<FormDependencyType>;
}> = (props) => {
  const values = useWatch({
    control: props?.control,
    name: props?.dependencies?.map((d) => d?.name),
  });

  const deps = useMemo(
    () =>
      values?.map?.((v, index) => ({
        name: props?.dependencies?.[index]?.name,
        visibleWhen: props?.dependencies?.[index]?.visibleWhen,
        value: v,
      })),
    // eslint-disable-next-line
    [values]
  );

  if (deps?.every((d) => d?.visibleWhen?.(d?.value)) || !deps) {
    return <>{props?.children}</>;
  }
  return null;
};

const FormItemWrapper: React.FC<
  UseFormReturn<any> & {
    child: ReactNode;
    Inputs?: React.MutableRefObject<Array<HTMLInputElement | null>>;
    index?: number;
  }
> = (props) => {
  const { Inputs, index } = props;

  return (
    <DependencyWrapper
      control={props?.control}
      dependencies={(props?.child as any)?.props?.dependencies}
    >
      <div>
        <Controller
          shouldUnregister={
            !(props?.child as any)?.props?.dontUnregisterWhenNotVisible
          }
          name={(props?.child as any)?.props?.name}
          control={props?.control}
          rules={(props?.child as any)?.props?.rules}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) =>
            cloneElement(props?.child as any, {
              onChange,
              onBlur,
              value,
              name: (props?.child as any)?.props?.name,
              Inputs,
              index,
              error: error?.message,
              control: props?.control,
              setValue: props?.setValue,
              getValues: props?.getValues,
            })
          }
        />
      </div>
    </DependencyWrapper>
  );
};

export default FormItemWrapper;
