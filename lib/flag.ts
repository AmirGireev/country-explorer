export const flagUrl = (code: string, width = 320) =>
  `https://flags.restcountries.com/v5/w${width}/${code.toLowerCase()}.png`;