import {
  Context,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';
import { getSelectorContext } from './createSelectorProvider';

type Selector<TContext, TSelected> = (state: TContext) => TSelected;

export function useContextSelector<T, TSelected>(
  context: Context<T>,
  selector: Selector<T, TSelected>
): TSelected {
  const accessorContext = getSelectorContext(context);
  const [accessor, listeners] = useContext(accessorContext);
  const [, forceUpdate] = useReducer(dummy => dummy + 1, 0);

  const latestSelector = useRef(selector);
  const latestSelectedState = useRef<any>();

  const currentValue = accessor();

  if (currentValue === undefined) {
    throw new Error('You must call useContextSelector inside a valid context.');
  }

  const selectedState = useMemo(() => selector(currentValue), [
    currentValue,
    selector
  ]);

  useEffect(() => {
    latestSelector.current = selector;
    latestSelectedState.current = selectedState;
  }, [currentValue, selectedState, selector]);

  useEffect(() => {
    const listener = (nextValue: T) => {
      const newSelectedState =
        latestSelector.current && latestSelector.current(nextValue);

      if (newSelectedState !== latestSelectedState.current) {
        forceUpdate({});
      }
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, [listeners]);

  return selectedState;
}

export default useContextSelector;
