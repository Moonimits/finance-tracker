export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  wait: number = 500
) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      callback(...args)
    }, wait)
  }
}
