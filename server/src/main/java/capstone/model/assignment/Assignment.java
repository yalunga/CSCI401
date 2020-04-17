package capstone.model.assignment;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public abstract class Assignment {
	@Id
	@GeneratedValue
	private Long assignmentId; 

	//Basic information
	private String assignmentType; 
	private String dueDate;
	private String submitDateTime;
	public int semester; 
	public int fallSpring;


	public Long getAssignmentId() {
		return assignmentId; 
	}

	public void setAssignmentId(Long id) 
	{
		this.assignmentId = id;
	}
 
	public String getAssignmentType() {
		return assignmentType;
	}
	public void setAssignmentType(String assignmentType) {
		this.assignmentType = assignmentType;
	}

	public int getSemester() {
		return semester;
	}

	public void setSemester(int semester) {
		this.semester = semester;
	}

	public int getFallSpring() {
		return fallSpring;
	}

	public void setFallSpring(int fallSpring) {
		this.fallSpring = fallSpring;
	}

	public String getDueDate() {
		return dueDate;
	}

	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}

	public String getSubmitDateTime() {
		return submitDateTime;
	}

	public void setSubmitDateTime(String submitDateTime) {
		this.submitDateTime = submitDateTime;
	}

 
}
