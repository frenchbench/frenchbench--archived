export function genericFilterFieldEqualsValue(qryBuilder, fieldName, fieldValue) {
  if (fieldValue) {
    qryBuilder.where(fieldName, fieldValue);
  }
}

export function makeGenericFilter(name) {
  return {
    paramName: name,
    fieldName: name,
    filter:    genericFilterFieldEqualsValue,
  }
}
