import { tablesFilters } from '../tablesFilters';

export function makeListHandler(dbAdapter, tableName, fields = '*') {
  // return a function that can handle HTTP requests
  return async (req, res) => {
    const urlParams = req.query;
    let { offset = 0, limit = 0 } = urlParams;
    let data = [], count = 0;

    try {
      let dbQry = dbAdapter.table(tableName, fields);

      // add generic tableFilters
      if (tablesFilters.hasOwnProperty(tableName)) {
        const filtersOfTable = tablesFilters[tableName];
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
