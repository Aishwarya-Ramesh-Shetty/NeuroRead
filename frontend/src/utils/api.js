export function extractApiErrorMessage(error, fallbackMessage = 'Something went wrong.') {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

export function mapEntityId(entity) {
  if (!entity) {
    return entity;
  }

  return {
    ...entity,
    id: entity.id ?? entity._id
  };
}
