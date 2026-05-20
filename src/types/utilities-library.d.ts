declare module "@rodrigo-barraza/utilities-library/rate" {
  export function debounce<T extends Function>(
    func: T,
    wait: number,
    immediate?: boolean,
  ): T & { cancel: () => void };

  export function throttle<T extends Function>(
    func: T,
    wait: number,
    options?: { leading?: boolean; trailing?: boolean },
  ): T & { cancel: () => void };
}
