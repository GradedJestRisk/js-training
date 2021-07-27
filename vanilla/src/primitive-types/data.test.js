describe('timestamp', () => {

   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

   describe('instantiate', () => {
      test('#new() return actual timestamp', () => {
         const now = new Date()
         expect(now).not.toBeNull()
      })

      test('#Date build date', () => {
         const dateString = 'December 30, 2017 11:20:25'
         const date = new Date(dateString)
         expect(date).not.toBeNull()
      })

      test('#UTC build date', () => {
         const date = new Date(Date.UTC(96, 1, 2, 3, 4, 5))
         const dateString = date.toUTCString()
         expect(dateString).toStrictEqual('Fri, 02 Feb 1996 03:04:05 GMT')
      })
   })

   describe('convert', () => {

      test('#toString build date from String', () => {
         const dateString = 'December 30, 2017 11:20:25'
         const date = new Date(dateString)
         expect(date.toString()).toStrictEqual('Sat Dec 30 2017 11:20:25 GMT+0100 (Central European Standard Time)')
      })

      test('#toUTCString build string from date', () => {
         const date = new Date(Date.UTC(1996, 1, 2, 3, 4, 5))
         const dateString = date.toUTCString()
         expect(dateString).toStrictEqual('Fri, 02 Feb 1996 03:04:05 GMT')
      })

      test('#getTime returns milliseconds since epoch', () => {
         const date = new Date('December 20, 2017 11:20:25')
         expect(date.getTime()).toStrictEqual(1513765225000)
      })

      test('#get extract portions', () => {

         const year = 1996
         const monthOrdinal = 2
         const dayOrdinal = 2
         const hours = 3
         const minutes = 4
         const seconds = 5
         const date = new Date(Date.UTC(year, monthOrdinal, dayOrdinal, hours, minutes, seconds))

         const hourDelta = 1
         expect(date.getFullYear()).toStrictEqual(year)
         expect(date.getMonth()).toStrictEqual(monthOrdinal)
         expect(date.getDate()).toStrictEqual(dayOrdinal)
         expect(date.getUTCHours()).toStrictEqual(hours)
         expect(date.getHours()).toStrictEqual(hours + hourDelta)
         expect(date.getMinutes()).toStrictEqual(minutes)
         expect(date.getSeconds()).toStrictEqual(seconds)

      })

   })

   describe('operate', () => {

      test('#setDate change day of month', () => {
         const date = new Date('December 30, 2017 11:20:25')
         date.setDate(1)
         expect(date).toStrictEqual(new Date('December 1, 2017 11:20:25'))
      })

      test('substract date', () => {
         const deltaDay = 10
         const date = new Date('December 30, 2017 11:20:25')
         date.setDate(date.getDate() - deltaDay)
         expect(date).toStrictEqual(new Date('December 20, 2017 11:20:25'))
      })

      test('substract minutes', () => {
         const MS_PER_MINUTE = 60 * 1000
         const deltaMinutes = 10
         const start = new Date('December 20, 2017 11:20:25')
         const end = new Date(start.getTime() + deltaMinutes * MS_PER_MINUTE)
         expect(end).toStrictEqual(new Date('December 20, 2017 11:30:25'))
      })

   })

})
