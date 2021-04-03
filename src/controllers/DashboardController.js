const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
  index(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();

    let statusCount = {
      progress: 0, 
      done: 0, 
      total: jobs.length
    }
    //total de horas/dia por job in progress
    let jobTotalHours = 0

    const updatedJobs = jobs.map((job) => {
      // ajustes no job
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? "done" : "progress";
      //incrementando a quantidade de status
      statusCount[status] += 1;
      //total de horas/dia por job in progress
      jobTotalHours = status=='progress' ? jobTotalHours + Number(job["daily-hours"]) : jobTotalHours

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"])
      }
    })
    //quantidade de horas/dia que quero trabalhar(profile) -(menos) quantidade de horas/dia de job in progress.
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours
    })
  }
}