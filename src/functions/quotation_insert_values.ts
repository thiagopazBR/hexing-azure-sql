const quotation = (x: string | undefined): string | undefined => {
  if (x) return `'${x}'`
  else return 'null'
}

export { quotation }
