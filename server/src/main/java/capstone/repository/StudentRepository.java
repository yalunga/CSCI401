package capstone.repository;

import java.util.List;
import java.util.ArrayList;

import javax.transaction.Transactional;

import capstone.model.Project;
import capstone.model.users.Student;
import capstone.model.users.User;

@Transactional
public interface StudentRepository extends UserBaseRepository<Student> {
  Student findByUserId(Long user_id);

  List<User> findAllByProjectId(int projectId); /* ... */

  ArrayList<Student> findBySemesterAndFallSpring(int semester, int fallSpring);
}