package com.jobtracker.jobtracker.repository;

import com.jobtracker.jobtracker.model.Job;
import com.jobtracker.jobtracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByUser(User user);
}
