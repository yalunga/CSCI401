package capstone.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class ProjectRanking {
	@Id
	@GeneratedValue
	private int id;
	private int studentId;
	private int projectId;
	private int ranking;
}
