describe('timestamp', () => {

   // Date type is actually a timestamp/datetime, including hour:minute:seconds
   // Date as we speak of 23rd or March 2023, aka date-only, is not supported

   describe('time zone', () => {

      test('get the time zone name: #Intl.timeZone', () => {
         // we're on Paris timezone
         expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toEqual('Europe/Paris');
      });

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
      test('get the offset (in minutes): #getTimezoneOffset', () => {

         // the offset is time(UTC) - time(locale)
         // negative if ahead of UTC, eg 01:00-02:00 = -60 minutes
         // Paris winter offset is -1 hour, meaning one hour AHEAD of UTC
         expect(new Date('2017-12-31T23:59:59').getTimezoneOffset()).toEqual(-60);
      });
   });


   describe('instantiate', () => {

      test('new Date() return actual timestamp', () => {
         // given
         const expected = new Date('October 22, 2026 12:12:25Z');

         // when
         const actual = new Date();

         // then
         expect(actual).not.toBeNulll;
         // expect(actual).toEqual(expected);
      });

      describe('new Date($DATE) build date', () => {

         describe('single parameter', () => {

            test('litterate format (December ..Z)', () => {
               // given
               const dateString = 'December 30, 2017 11:20:25Z';

               // when
               const actual = new Date(dateString);

               // then
               const expected = new Date(Date.UTC(2017, 12 - 1, 30, 11, 20, 25));
               expect(actual).toEqual(expected);
            });


            // ECMA "date time string format" is "YYYY-MM-DDTHH:mm:ss.sssZ"
            describe('machine format (only number)', () => {

               describe('date-only (YYYY-MM-DD)', () => {
                  test('without timezone, is default timezone', () => {
                     // given
                     const dateString = '2017-12-31';

                     // when
                     const actual = new Date(dateString);

                     // then
                     const expected = new Date('December 31, 2017 00:00:00 Z');
                     expect(actual).toEqual(expected);
                  });
                  test('with default timezone (Z)', () => {
                     // given
                     const dateString = '2017-12-31Z';

                     // when
                     const actual = new Date(dateString);

                     // then
                     const expected = new Date('December 31, 2017 00:00:00 Z');
                     expect(actual).toEqual(expected);
                  });
                  test('with explicit timezone (UTC+01:00)', () => {
                     // given
                     const dateString = '2018-01-01 UTC+01:00';

                     // when
                     const actual = new Date(dateString);

                     // then
                     const expected = new Date('December 31, 2017 23:00:00 Z');
                     expect(actual).toEqual(expected);
                  });
               });
               describe('date-time', () => {

                  test('Paris timezone is -60 related to GMT', () => {
                     // we're on Paris timezone
                     expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toEqual('Europe/Paris');

                     // the offset is -1 hour
                     expect(new Date('2017-12-31T23:59:59').getTimezoneOffset()).toEqual(-60);
                  });
                  test('without timezone, use the locale timezone (Paris)', () => {
                     // given
                     const dateString = '2018-01-01T01:59:59';

                     // when
                     const actual = new Date(dateString);

                     // then
                     const expected = new Date('January 01, 2018 00:59:59 Z');
                     expect(actual).toEqual(expected);
                  });
                  test('with default timezone (Z)', () => {
                     // given
                     const dateString = '2018-01-01T00:00:00Z';

                     // when
                     const actual = new Date(dateString);

                     // then
                     const expected = new Date('January 01, 2018 00:00:00 Z');
                     expect(actual).toEqual(expected);
                  });
                  test('with explicit timezone (-01:00) ', () => {
                     // given
                     const dateString = '2017-12-31T23:59:59-01:00';

                     // when
                     const actual = new Date(dateString);

                     // then
                     const expected = new Date('January 01, 2018 00:59:59 Z');
                     expect(actual).toEqual(expected);
                  });
               });

            });
         });

         test('passing components individually', () => {
            const date = new Date(Date.UTC(96, 1, 2, 3, 4, 5));
            const dateString = date.toUTCString();
            expect(dateString).toStrictEqual('Fri, 02 Feb 1996 03:04:05 GMT');
         });
      });

   });

   describe('convert', () => {

      describe('from string', () => {
         describe('to date', () => {

            test('#toString', () => {
               const dateString = 'December 30, 2017 11:20:25';
               const date = new Date(dateString);
               expect(date.toString()).toStrictEqual('Sat Dec 30 2017 11:20:25 GMT+0100 (Central European Standard Time)');
            });
         });
      });


      describe('from date', () => {
         describe('to string', () => {
            describe('in UTC format', () => {

               test('#toUTCString returns a verbose output at the base (UTC+00:00/GMT)', () => {
                  const date = new Date(Date.UTC(1996, 1, 2, 3, 4, 5));

                  // when
                  const dateString = date.toUTCString();

                  // then
                  // https://en.wikipedia.org/wiki/UTC+00:00
                  expect(dateString).toStrictEqual('Fri, 02 Feb 1996 03:04:05 GMT');
               });
            });

            describe('in ISO format', () => {
               // ISO refer to ISO-8601
               // https://en.wikipedia.org/wiki/ISO_8601
               // Date is YYYY-MM-DD
               // Time is HH:MI:SSZ => Z stands for UTC+00:00
               // Date and time: ${DATE}T${TIME}
               test('#toISOString()', () => {
                  // given
                  const monthZeroBased = 11 - 1;
                  const date = new Date(Date.UTC(2022, monthZeroBased, 12, 1, 0, 0));

                  // when
                  const dateString = date.toISOString();

                  // then
                  expect(dateString).toStrictEqual('2022-11-12T01:00:00.000Z');
                  expect(dateString.substring(0, 10)).toStrictEqual('2022-11-12');
               });
            });

            describe('in locale format', () => {

               // Test all locales
               // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tolocalestring_date_all
               describe('for en-US locale', () => {

                  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
                  test('#toLocaleString() returns dd/mm/yyyy', () => {
                     // given
                     expect(new Intl.DateTimeFormat().resolvedOptions().locale).toEqual('en-US');

                     const day = 12;
                     const monthZeroBased = 11 - 1;
                     const year = 2022;
                     const date = new Date(Date.UTC(year, monthZeroBased, day, 0, 2, 3));

                     // when
                     const dateString = date.toLocaleString();

                     // then
                     expect(dateString).toStrictEqual('11/12/2022, 1:02:03 AM');
                     expect(dateString.substring(0, 10)).toStrictEqual('11/12/2022');
                  });
               });
            });


            describe('to portion (month, day)', () => {
               test('get$PORTION', () => {

                  const year = 1996;
                  const monthOrdinal = 2;
                  const dayOrdinal = 2;
                  const hours = 3;
                  const minutes = 4;
                  const seconds = 5;
                  const date = new Date(Date.UTC(year, monthOrdinal, dayOrdinal, hours, minutes, seconds));

                  const hourDelta = 1;
                  expect(date.getFullYear()).toStrictEqual(year);
                  expect(date.getMonth()).toStrictEqual(monthOrdinal);
                  expect(date.getDate()).toStrictEqual(dayOrdinal);
                  expect(date.getUTCHours()).toStrictEqual(hours);
                  expect(date.getHours()).toStrictEqual(hours + hourDelta);
                  expect(date.getMinutes()).toStrictEqual(minutes);
                  expect(date.getSeconds()).toStrictEqual(seconds);

               });
            });

         });

         describe('to epoch', () => {

            test('#getTime returns milliseconds since epoch', () => {
               const date = new Date('December 20, 2017 11:20:25');
               expect(date.getTime()).toStrictEqual(1513765225000);
            });

         });


      });


   });

   describe('operate', () => {

      test('#setDate change day of month', () => {
         const date = new Date('December 30, 2017 11:20:25');
         date.setDate(1);
         expect(date).toStrictEqual(new Date('December 1, 2017 11:20:25'));
      });

      test('substract date', () => {
         const deltaDay = 10;
         const date = new Date('December 30, 2017 11:20:25');
         date.setDate(date.getDate() - deltaDay);
         expect(date).toStrictEqual(new Date('December 20, 2017 11:20:25'));
      });

      test('substract minutes', () => {
         const MS_PER_MINUTE = 60 * 1000;
         const deltaMinutes = 10;
         const start = new Date('December 20, 2017 11:20:25');
         const end = new Date(start.getTime() + deltaMinutes * MS_PER_MINUTE);
         expect(end).toStrictEqual(new Date('December 20, 2017 11:30:25'));
      });

   });

});
