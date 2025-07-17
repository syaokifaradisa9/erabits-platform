export const sumList = (list) => {
    return list.reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
};
