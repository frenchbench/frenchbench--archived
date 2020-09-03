const beforeCreateDefaultFunc = async (tableName, row) => Promise.resolve(row);
const afterCreateDefaultFunc = async (tableName, result) => Promise.resolve(result[0]);

export function makeCreateHandler(
  dbAdapter,
  tableName,
  fields = '*',
  beforeCreate = beforeCreateDefaultFunc,
  afterCreate = afterCreateDefaultFunc,
){
  return async (req, res) => {
    const { data } = req.body;
    try {
      const rowIn = await beforeCreate(tableName, data);
      const result = await dbAdapter.insert(tableName, rowIn).returning(fields);
      const rowOut = await afterCreate(tableName, result);
      res.json({ data: rowOut });
    } catch (err) {
      console.error('Error in makeCreateHandler', tableName, err);
      if (String(err.message).includes('invalid')) {
        res.status(400).json({ data: null, error: 'bad request'});
      } else {
        res.status(500).json({ data: null, error: 'unexpected error'});
      }
    }
  };
}
