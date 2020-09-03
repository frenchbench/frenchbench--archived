const beforeUpdateDefaultFunc = async (id, oldRow, newRow) => Promise.resolve(newRow);
const afterUpdateDefaultFunc = async (result) => Promise.resolve(result);

export function makeUpdateHandler(
  dbAdapter,
  tableName,
  idField = 'id',
  beforeUpdate = beforeUpdateDefaultFunc,
  afterUpdate = afterUpdateDefaultFunc,
){
  return async (req, res) => {
    const { id, data: newRow } = req.body;
    try {
      const rows = await dbAdapter.table(tableName).where(idField, id);
      const oldRow = rows[0] ? rows[0] : null;
      if (!oldRow) {
        res.status(404).json({ data: null, error: 'not found' });
        return;
      }
      const changes = await beforeUpdate(id, oldRow, newRow);
      const result = await dbAdapter.update(tableName, { field: idField, value: id }, changes);
      const rowOut = await afterUpdate(result);
      res.json({ data: rowOut });
    } catch (err) {
      console.error('Error in makeUpdateHandler', tableName, err);
      if (String(err.message).includes('invalid')) {
        res.status(400).json({ data: null, error: 'bad request'});
      } else {
        res.status(500).json({ data: null, error: 'unexpected error'});
      }
    }
  };
}
