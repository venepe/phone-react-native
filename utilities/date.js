import moment from 'moment';

export const getDateDiffText = (date) => {
  const seconds = moment.utc().diff(moment(date), 'seconds');
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = moment.utc().diff(moment(date), 'minutes');
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = moment.utc().diff(moment(date), 'hours');
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = moment.utc().diff(moment(date), 'days');
  if (days < 7) {
    return `${days}d`;
  }
  const weeks = moment.utc().diff(moment(date), 'weeks');
  if (weeks < 4) {
    return `${weeks}w`;
  }
  const months = moment.utc().diff(moment(date), 'months');
  if (months < 12) {
    return `${months}mo`;
  }
  const years = moment.utc().diff(moment(date), 'years');
  return `${years}y`;
}

export const getDateTimeText = (date) => {
  const hours = moment.utc().diff(moment(date), 'hours');
  if (hours < 24) {
    return moment(date).format('h:mm A');
  } else {
    return moment(date).format('MMM D, h:mm A');
  }
}
