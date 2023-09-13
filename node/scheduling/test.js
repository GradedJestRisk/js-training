// https://github.com/1024pix/pix-db-stats/blob/master/tests/integration/application/schedule-task_test.js#L14-L14
// The trick is to split concerns
// - the scheduler init script program all executions
// - the task themselves execute code
//
// This way, you can
// - test tasks by running them in isolation
// - test scheduler by asserting the task is not called at startup but only at scheduling time
