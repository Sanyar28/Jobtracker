package com.jobtracker.jobtracker.scheduler;

import com.jobtracker.jobtracker.model.Job;
import com.jobtracker.jobtracker.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class EmailScheduler {

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Scheduled(cron = "0 0 9 * * *")
    public void sendDeadlineReminders() {
        System.out.println("Scheduler running at: " + LocalDate.now());
        LocalDate soon = LocalDate.now().plusDays(3);
        List<Job> allJobs = jobRepo.findAll();
        System.out.println("Total jobs found: " + allJobs.size());

        for (Job job : allJobs) {
            if (job.getDeadline() != null && job.getDeadline().isBefore(soon)) {
                System.out.println("Sending email for: " + job.getCompany());
                sendEmail(
                    job.getUser().getEmail(),
                    "Deadline Reminder: " + job.getCompany(),
                    "Hi! Your application deadline for " + job.getCompany() +
                    " (" + job.getRole() + ") is on " + job.getDeadline() + ". Good luck!"
                );
            }
        }
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
