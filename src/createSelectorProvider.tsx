import React, {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';

const contextMap: Map<Context<any>, Context<any>> = new Map();

interface ProviderProps<T> {
  readonly value: T;
  readonly children: ReactNode;
}

type ContextAccessor<T> = () => T;
type ContextListener<T> = (state: T) => void;
type ContextListeners<T> = Set<ContextListener<T>>;
type SelectorContextType<T> = readonly [
  ContextAccessor<T>,
  ContextListeners<T>
];

export function createSelectorProvider<T>(
  OriginalContext: Context<T>
): FunctionComponent<ProviderProps<T>> {
  const SelectorContext = createContext<SelectorContextType<T>>([
    () => undefined,
    new Set()
  ]);

  contextMap.set(OriginalContext, SelectorContext);

  const Provider = ({ children, value }) => {
    const contextValueRef = useRef(value);

    const listeners = useRef<ContextListeners<T>>(new Set());

    useEffect(() => {
      contextValueRef.current = value;

      listeners.current.forEach(listener => {
        listener(value);
      });
    }, [value]);

    const getContextValue: ContextAccessor<T> = useCallback(() => {
      return contextValueRef.current;
    }, [contextValueRef]);

    const contextValue: SelectorContextType<T> = useMemo(
      () => [getContextValue, listeners.current],
      [contextValueRef]
    );

    return (
      <OriginalContext.Provider value={value}>
        <SelectorContext.Provider value={contextValue}>
          {children}
        </SelectorContext.Provider>
      </OriginalContext.Provider>
    );
  };

  return Provider;
}

export function getSelectorContext<T>(
  context: Context<T>
): Context<SelectorContextType<T>> {
  return contextMap.get(context);
}
