package capstone.model.assignment;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.MapsId;

import capstone.model.Project;
import capstone.model.assignment.WeeklyReport;
import capstone.model.users.Student;

@Entity
public class Task extends Assignment {
	//@EmbeddedId TaskId id;
	public String taskid;
	
	@OneToOne(targetEntity= Project.class)
	Project project;

	@OneToOne(targetEntity= Student.class)
	Student student;

	@OneToOne(targetEntity= WeeklyReport.class)
	WeeklyReport report;
	 
	private String hours;
	private String description;

	

	public String getHours() {
		return hours; 
	}

	public void setHours(String _hours) {
		this.hours = _hours;
	}
	
	public String getDescription() {
		return description; 
	}

	public void setDescription(String desc) {
		this.description = desc;
	}

	public String getTaskid() {
		return taskid;
	}

	public void setTaskid(String taskid) {
		this.taskid = taskid;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public WeeklyReport getReport() {
		return report;
	}

	public void setReport(WeeklyReport report) {
		this.report = report;
	}
}
