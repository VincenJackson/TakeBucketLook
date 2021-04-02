var task = {
    doTask: async (axios, options) => {
        const { task, moneytree } = options
        await moneytree.doWork(axios, {
            ...options,
            task,
            opType: 1
        })
    }
}

module.exports = task