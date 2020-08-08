//import * as controllers from '../controllers';

export function newHttpRoutes({ config, logger, httpRouter, dbAdapterFb }) {
  // const controllerList = [
  //   controllers.lookups({ config, logger, dbAdapterFb }),
  // ];
  // // intentionally cause side-effects
  // controllerList.forEach(({ route, create, retrieve, update, deleteOne, list }) => {
  //   if (create)    httpRouter.post(route, create);
  //   if (retrieve)  httpRouter.get(route + '/:id', retrieve);
  //   if (update)    httpRouter.put(route + '/:id', update);
  //   if (update)    httpRouter.patch(route + '/:id', update);
  //   if (deleteOne) httpRouter.delete(route + '/:id', deleteOne);
  //   if (list)      httpRouter.get(route, list);
  // });

  httpRouter.get('/', (req, res) => {
    res.json({ ts: new Date(), version: config.version });
  });

  return httpRouter;
}
