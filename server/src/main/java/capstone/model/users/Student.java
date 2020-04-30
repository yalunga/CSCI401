package capstone.model.users;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

import capstone.model.Project;

@Entity
public class Student extends User {
  public String uscid; // only valid if userType = Student
  // public int semester;
  // public int fallSpring;

  private Integer projectId;

  @Transient
  public Map<String, Integer> rankings;
  @Transient
  public List<Integer> orderedRankings;

  public Student() {
    setRankings(new HashMap<String, Integer>());
    setOrderedRankings(new Vector<Integer>());
  }

  public Student(Student orig) {
    this.setFirstName(orig.getFirstName());
    this.setLastName(orig.getLastName());
    this.setEmail(orig.getEmail());
    this.setUserId(orig.getUserId());
    this.projectId = orig.projectId;
    this.rankings = orig.rankings;
    this.orderedRankings = orig.orderedRankings;
    this.semester = orig.semester;
    this.fallSpring = orig.fallSpring;
  }

  public String toString() {
    return ("Student #" + this.uscid + ": '" + this.getFirstName() + "' | " + this.getRankings());
  }

  public Integer getProjectId() {
    return projectId;
  }

  public void setProject(int projectId) {
    this.projectId = projectId;
  }

  public Map<String, Integer> getRankings() {
    return rankings;
  }

  public void setRankings(Map<String, Integer> rankings) {
    this.rankings = rankings;
  }

  public List<Integer> getOrderedRankings() {
    return orderedRankings;
  }

  public void setOrderedRankings(List<Integer> orderedRankings) {
    this.orderedRankings = orderedRankings;
  }
}
