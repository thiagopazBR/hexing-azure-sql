const check_int = (data: string): string | undefined => {
  if (!data.match(/^[0-9]+$/)) return undefined
  const int: number = parseInt(data)

  if (int < -2147483648 || int > 2147483647) return undefined
  return data
}

const check_char = (x: string, l: number): string | undefined => {
  if (x)
    if (x.trim().length > l) return undefined
    else return x.trim()
  else return undefined
}

const check_real = (data: string): string | undefined => {
  // Remove % sign of online rate and anythin less number, dash and dot
  const real = data.replace(/[^0-9.-]+/g, '')

  if (real.match(/^-?(0|[1-9]\d*)(\.\d+)?$/)) return real
  return undefined
}

const check_tinyint = (data: string): string | undefined => {
  if (!data.match(/^[0-9]+$/)) return undefined
  const tinyint: number = parseInt(data)

  if (tinyint > -1 && tinyint < 256) return data
  return undefined
}

export { check_int, check_char, check_real, check_tinyint }
