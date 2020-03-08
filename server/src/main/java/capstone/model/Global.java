package capstone.model;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Vector;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

import capstone.model.users.Student;
import capstone.util.ProjectAssignment;

@Entity
public class Global
{
	@Id
	@GeneratedValue
	int id;
	int semester;
	int fallSpring;

	public int getSemester() 
	{
		return semester;
	}

	public void setSemester(int semester)
{
		this.semester = semester;
	}

	public int getFallSpring() 
	{
		return fallSpring;
	}

	public void setFallSpring(int fallSpring) 
	{
		this.fallSpring = fallSpring;
	}
				
	public Global()
	{
		this.semester = 2020;
		this.fallSpring = 0;
	}
			
	public String toString() 
	{
		return ("Global | Semester: " + this.semester +  " | FallSpring: " + this.fallSpring);
	}
}