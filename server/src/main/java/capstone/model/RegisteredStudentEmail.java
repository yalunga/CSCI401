package capstone.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class RegisteredStudentEmail {
	@Id
	@GeneratedValue
	private long id;
	private String email;
	private int fallSpring;
	private int semester;
	
	public RegisteredStudentEmail() {
	}
	
	public RegisteredStudentEmail(String email, int fallSpring, int semester) {
		this.email = email;
		this.fallSpring = fallSpring;
		this.semester = semester;
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public int getFallSpring() {
		return fallSpring;
	}
	
	public int getSemester() {
		return semester;
	}
	
}
