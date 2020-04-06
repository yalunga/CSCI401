package capstone.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import capstone.model.assignment.Task;


@Transactional
public interface TaskRepository extends JpaRepository<Task, Long> {
    
}
