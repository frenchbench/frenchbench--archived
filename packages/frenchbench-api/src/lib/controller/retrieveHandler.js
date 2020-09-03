export function makeRetrieveHandler(dbAdapter, tableName, idField = 'id'){
  return async (req, res) => {
    const idValue = req.params.hasOwnProperty(idField) ? req.params[idField] : null;
    if (idValue !== null) {
      const rows = await dbAdapter.table(tableName).where(idField, idValue);
      const data = rows[0] ? rows[0] : null;
      if (data) {
        res.json({ data });
      } else {
        res.status(404).json({ data: null, error: 'not found' });
      }
    } else {
      res.status(400).json({ data: null, error: 'invalid id' });
    }
  };
}
