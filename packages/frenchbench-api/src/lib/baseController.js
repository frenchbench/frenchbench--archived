import * as constants from '../constants';

export function baseController({ config, logger, dbAdapter }) {

  function makeListHandler(tableName, fields = '*') {
    // return a function that can handle HTTP requests
    return async (req, res) => {
      const urlParams = req.query;
      let { offset = 0, limit = 0 } = urlParams;
      let data = [], count = 0;

      try {
        let dbQry = dbAdapter.table(tableName, fields);

        // add generic filters
        if (constants.filters.hasOwnProperty(tableName)) {
          const filtersOfTable = constants.filters[tableName];
          if (Array.isArray(filtersOfTable) && filtersOfTable.length) {
            if (Object.getOwnPropertyNames(urlParams).length) {
              dbQry.modify(qryBuilder => {
                filtersOfTable.forEach(({ paramName, fieldName, filter }) => {
                  if (urlParams.hasOwnProperty(paramName)) {
                    const fieldValue = urlParams[paramName];
                    // console.log(`${tableName}.${fieldName} = ${fieldValue}`);
                    filter(qryBuilder, fieldName, fieldValue);
                  }
                });
              });
            }
          }
        }

        const countDbQry = dbQry.clone();
        const countResult = await countDbQry.clearSelect().count('*', { as: 'count' });
        count = countResult[0].count;

        // add pagination
        if (limit) {
          dbQry.limit(limit);
        }

        data = await dbQry.offset(offset);
        res.json({ data, meta: { ts: new Date(), count }});

      } catch (err) {
        console.error('ERROR on makeListHandler for table ' + tableName, err);
        res.json({ error: err.message, ts: new Date() });
      }
    };
  }

  const beforeCreateDefaultFunc = async (row) => Promise.resolve(row);
  const afterCreateDefaultFunc = async (result) => Promise.resolve(result[0]);

  function makeCreateHandler(
    tableName,
    fields = '*',
    beforeCreate = beforeCreateDefaultFunc,
    afterCreate = afterCreateDefaultFunc,
  ){
    return async (req, res) => {
      const { data } = req.body;
      try {
        const rowIn = await beforeCreate(data);
        const result = await dbAdapter.insert(tableName, rowIn).returning(fields);
        const rowOut = await afterCreate(result);
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

  const beforeUpdateDefaultFunc = async (id, oldRow, newRow) => Promise.resolve(newRow);
  const afterUpdateDefaultFunc = async (result) => Promise.resolve(result);

  function makeUpdateHandler(
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

  function makeRetrieveHandler(tableName, idField = 'id'){
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

  const beforeDeleteDefaultFunc = async (id, row) => Promise.resolve(true);
  const afterDeleteDefaultFunc = async (result) => Promise.resolve(result);

  function makeDeleteHandler(
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

  return {
    makeCreateHandler,
    makeRetrieveHandler,
    makeUpdateHandler,
    makeDeleteHandler,
    makeListHandler,
  }
}

export function makeBaseController({ config, logger, dbAdapter, tableName, route }) {
  const base      = baseController({ config, logger, dbAdapter });
  const list      = base.makeListHandler(tableName);
  const create    = base.makeCreateHandler(tableName);
  const retrieve  = base.makeRetrieveHandler(tableName);
  const update    = base.makeUpdateHandler(tableName);
  const deleteOne = base.makeDeleteHandler(tableName);

  return {
    list,
    create,
    retrieve,
    update,
    deleteOne,
    route,
  };
}
