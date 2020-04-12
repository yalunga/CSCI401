package capstone.model.assignment;

import java.util.Vector;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.OneToMany;
import javax.persistence.CascadeType;


import org.springframework.scheduling.TaskScheduler;

import capstone.model.users.Student;
import capstone.model.Project;
import capstone.model.assignment.Task;

@Entity
public class WeeklyReport extends Assignment
{
	//@MapsId("student_id")
	@OneToOne(targetEntity = Student.class)
	Student student;
	
//	@MapsId("project_id")
	@OneToOne(targetEntity = Project.class)
	Project project;

	@OneToMany(targetEntity= Task.class, cascade=CascadeType.ALL)
	private List<Task> thisWeekTasks;

	@OneToMany(targetEntity= Task.class, cascade=CascadeType.ALL)
	private List<Task> nextWeekTasks;

	public WeeklyReport() {

		 setThisWeekTasks(new ArrayList<Task>());
		 setNextWeekTasks(new ArrayList<Task>());
	}

	public WeeklyReport(WeeklyReport orig) {
		 
		this.setAssignmentId(orig.getAssignmentId());
		this.student = orig.student;
		this.project = orig.project;
		this.thisWeekTasks = orig.thisWeekTasks;
		this.nextWeekTasks = orig.nextWeekTasks;
		this.semester = orig.semester;
		this.fallSpring = orig.fallSpring;
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

	public List<Task> getThisWeekTasks() {
		return thisWeekTasks;
	}

	public void setThisWeekTasks(List<Task> thisweekTasks) {
		this.thisWeekTasks = thisweekTasks;
	}

	public List<Task> getNextWeekTasks() {
		return nextWeekTasks;
	}

	public void setNextWeekTasks(List<Task> nextweekTasks) {
		this.nextWeekTasks = nextweekTasks;
	}
	
	

}