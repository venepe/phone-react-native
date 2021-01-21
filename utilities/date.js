import moment from 'moment';

export const getDateDiffText = (date) => {
  const seconds = moment.utc().diff(moment(date, moment.ISO_8601), 'seconds');
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = moment.utc().diff(moment(date, moment.ISO_8601), 'minutes');
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = moment.utc().diff(moment(date, moment.ISO_8601), 'hours');
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = moment.utc().diff(moment(date, moment.ISO_8601), 'days');
  if (days < 7) {
    return `${days}d`;
  }
  const weeks = moment.utc().diff(moment(date, moment.ISO_8601), 'weeks');
  if (weeks < 4) {
    return `${weeks}w`;
  }
  const months = moment.utc().diff(moment(date, moment.ISO_8601), 'months');
  if (months < 12) {
    return `${months}mo`;
  }
  const years = moment.utc().diff(moment(date, moment.ISO_8601), 'years');
  return `${years}y`;
}
