package capstone.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import capstone.model.assignment.DueDate;

@RepositoryRestResource
public interface DueDateRepository extends JpaRepository<DueDate, Long> {
  ArrayList<DueDate> findBySemesterAndFallSpring(int semester, int fallSpring);
}