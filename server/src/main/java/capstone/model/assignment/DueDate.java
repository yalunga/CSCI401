package capstone.model.assignment;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class DueDate {
  @Id
  @GeneratedValue
  private Long dueDateId;

  private String dueDateString;
  private int semester;
  private int fallSpring;

  public Long getDueDateId() {
    return dueDateId;
  }

  public String getDueDateSring() {
    return dueDateString;
  }

  public void setDueDateString(String dueDateString) {
    this.dueDateString = dueDateString;
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
}