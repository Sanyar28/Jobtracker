package com.jobtracker.jobtracker.controller;

import com.jobtracker.jobtracker.model.Job;
import com.jobtracker.jobtracker.model.User;
import com.jobtracker.jobtracker.repository.JobRepository;
import com.jobtracker.jobtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private UserRepository userRepo;

    private User getCurrentUser(Principal principal) {
        return userRepo.findByUsername(principal.getName()).orElseThrow();
    }

    @GetMapping
    public List<Job> getAll(Principal principal) {
        return jobRepo.findByUser(getCurrentUser(principal));
    }

    @PostMapping
    public Job create(@RequestBody Job job, Principal principal) {
        job.setUser(getCurrentUser(principal));
        return jobRepo.save(job);
    }

    @PutMapping("/{id}")
    public Job update(@PathVariable Long id, @RequestBody Job job, Principal principal) {
        job.setId(id);
        job.setUser(getCurrentUser(principal));
        return jobRepo.save(job);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        jobRepo.deleteById(id);
    }
}