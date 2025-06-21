exports.getDueDate = (days = 14) => {
  const due = new Date();
  due.setDate(due.getDate() + days);
  return due;
};

exports.isOverdue = (dueDate) => {
  return new Date() > new Date(dueDate);
};
