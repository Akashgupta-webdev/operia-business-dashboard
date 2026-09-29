export const documentKeys = {
  all: ['documents'],
  list: (filters) => [...documentKeys.all, 'list', filters],
};
