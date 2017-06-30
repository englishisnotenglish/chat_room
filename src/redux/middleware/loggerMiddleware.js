export default function loggerMiddleware({dispatch, getState}) {
    return function (next) {
        return action => {
            console.log(action);
            return next(action);
        }
    }
}