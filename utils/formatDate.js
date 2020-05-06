const { format, parseISO } = require('date-fns');

const formatter = (date, dateReplacement = '-', timeReplcament = ':') => {
  const upperToHyphenLower = (match, offset, string) => offset < 13 ? dateReplacement : timeReplcament;
  return date.replace(/[:]/g, upperToHyphenLower);
}

const dateFormatter = (date, formatString = 'do LLL yyyy') => format(parseISO(formatter(date)), formatString);

export { dateFormatter };
