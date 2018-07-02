var Day = {
    /**
     * 获取当天的数据
     * @param key key
     */
    getTodayInfo(key) {
        let data = localStorage.getItem('daily_' + key)
        if (!data || data == '') {
            data = '{}'
            localStorage.setItem('daily_' + key, '{}')
        }
        return JSON.parse(data)
    },
    setTodayInfo(key, data) {
        localStorage.setItem('daily_' + key, JSON.stringify(data))
    }
}
