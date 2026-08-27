export const createOperation = (type,userId,baseVersion,payload) => {
    return {
        operationId: crypto.randomUUID(),
        type,
        userId,
        baseVersion,
        payload
    };
};