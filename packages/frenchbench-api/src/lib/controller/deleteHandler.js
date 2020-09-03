const beforeDeleteDefaultFunc = async (id, row) => Promise.resolve(true);
const afterDeleteDefaultFunc = async (result) => Promise.resolve(result);

export function makeDeleteHandler(
  dbAdapter,
  tableName,
  idField = 'id',
  beforeDelete = beforeDeleteDefaultFunc,
  afterDelete = afterDeleteDefaultFunc,
){
  return async (req, res) => {
    const { id } = req.params;
    try {
      const rows = await dbAdapter.table(tableName).where(idField, id);
      const row = rows[0] ? rows[0] : null;
      if (!row) {
        res.status(404).json({ data: null, error: 'not found' }); return;
      }
      const allowed = await beforeDelete(id, row);
      if (!allowed) {
        res.status(403).json({ data: null, error: 'forbidden' }); return;
      }
      const result = await dbAdapter.deleteMany(tableName, { field: idField, value: id });
      const rowOut = await afterDelete(result);
      res.json({ data: rowOut });
    } catch (err) {
      console.error('Error in makeDeleteHandler', tableName, err);
      if (String(err.message).includes('invalid')) {
        res.status(400).json({ data: null, error: 'bad request'});
      } else {
        res.status(500).json({ data: null, error: 'unexpected error'});
      }
    }
  };
}
