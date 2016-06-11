// Toggle a job
function toggle(job_name, job_schedule) {
  $.ajax({
    type: 'PUT',
    url: '/jobs',
    data: {
      format: 'json',
      job_name: job_name,
      job_schedule: job_schedule
    },
    error: function() {
      console.log('An error has occurred. :('); // TODO
    },
    success: function(data) {
      console.log('Successfully toggled the job!'); // TODO
    }
  });
}
