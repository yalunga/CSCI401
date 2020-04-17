package capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import capstone.model.assignment.Assignment;
import capstone.model.users.Stakeholder;
import capstone.model.users.Student;

@NoRepositoryBean
public interface AssignmentBaseRepository <T extends Assignment> extends JpaRepository<T, Long> {
    public T findBySemester(int semester);
    public T findByStudent(Student s);
    //public T findByStakeholder(Stakeholder s);
}
