import { ReactNode } from 'react';

export interface ObjectOfAny {
  [key: string]: any;
}

export type FormProps<T> =
  // @ts-ignore
  UseFormReturn<T> & {
    isNotModal?: boolean;
    children: ReactNode;
    onDone?: (values: any) => void;
    uri?: any;
    _id?: string;
    type?: any;

    /**
     *
     * a function that is called before the data is send to the backend, the return value will be sent to the backend directly without validation
     */
    transformFields?: (changes: ObjectOfAny) => ObjectOfAny;

    /**
     * callback that is triggered after the response is received
     *
     */
    onResponse?: (response: any) => void;

    /**
     *
     * when set to false the the data will contain the whole form, otherwise it will contain only the chagned values
     * set this to false when creating an entity
     * DEFAULTS TO TRUE
     * @type {boolean}
     */
    dirtyFieldsOnly?: boolean;

    /**
     * the style of the view that wraps the childrens
     *
     * @type {BasicStyleProp}
     */
    containerStyle?: any;
  };
export type FormDependencyType = {
  name: string;
  visibleWhen: (v: any) => boolean;
};

export type GameType = {
  _id: string;
  name: string;
  title: string;
  price: number;
  creatorName: string;
};

export type DepositType = {
  _id: string;
  amount: number;
  username: string;
  datetime: Date;
  message: string;
  refunded: boolean;
};
