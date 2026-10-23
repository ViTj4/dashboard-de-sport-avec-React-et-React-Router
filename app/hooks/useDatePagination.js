import { useNavigation, useSearchParams } from "react-router";
import { addDays, startOfWeek } from "~/utils/dates.js";

export function useDatePagination({ parameter, period, earliestDate }) {
  const [, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const earliestStart = startOfWeek(earliestDate);
  const pendingParams = navigation.location ? new URLSearchParams(navigation.location.search) : null;
  const isPending = pendingParams !== null && pendingParams.get(parameter) !== period.start &&
    (pendingParams.has(parameter) || period.start !== period.latestStart);

  function move(direction) {
    const target = addDays(period.start, direction * period.weekCount * 7);
    const bounded = target < earliestStart ? earliestStart : target > period.latestStart ? period.latestStart : target;
    setSearchParams((current) => {
      const next = new URLSearchParams(navigation.location?.search ?? current);
      if (bounded === period.latestStart) next.delete(parameter);
      else next.set(parameter, bounded);
      return next;
    }, { preventScrollReset: true });
  }

  return {
    isPending,
    canGoPrevious: period.start > earliestStart,
    canGoNext: period.start < period.latestStart,
    onPrevious: () => move(-1),
    onNext: () => move(1),
  };
}
