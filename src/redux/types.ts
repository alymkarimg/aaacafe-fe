export type DispatcherProps<T> = {
  type: string;
  payload?: Partial<T>;
};

export type Dispatcher<T> = (props: DispatcherProps<T>) => void;
