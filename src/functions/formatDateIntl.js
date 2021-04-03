const formatDateIntl = (params, date) => {
  return new Intl.DateTimeFormat("en", params).format(date);
};

export default formatDateIntl;
