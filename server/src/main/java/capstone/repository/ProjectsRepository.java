package capstone.repository;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import capstone.model.Project;


@RepositoryRestResource
public interface ProjectsRepository extends JpaRepository<Project, Long> {

	Project findByProjectId(int i);
  ArrayList<Project> findBySemesterAndFallSpring(int semester, int fallSpring);
	
}
