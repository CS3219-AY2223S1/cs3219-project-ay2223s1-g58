// sets number i as lower or upper if it exceeds the bounds
exports.setBetween = (i, upper, lower) => Math.min(upper, Math.max(i, lower));
