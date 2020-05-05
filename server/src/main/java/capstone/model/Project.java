package capstone.model;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Vector;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

import capstone.model.users.Stakeholder;
import capstone.model.users.Student;
import capstone.util.ProjectAssignment;
import capstone.model.Ranking;

@Entity
public class Project implements Comparable<Object> {
  // popularity metrics:
  double sum_p = 0; // sum of all students' satisfaction scores
  double p_max; // maximum satisfaction score for a single student (if NUM_RANKED = 3, this is
                // 4)
  double n; // number of students interested in this project
  double c; // cutoff
  double popularity;
  double projSatScore;

  @OneToMany(targetEntity = Student.class, cascade = CascadeType.ALL)
  public List<Student> members;

  // information that correlates directly to db.Projects
  @Id
  @GeneratedValue
  Integer projectId;
  String projectName;
  int statusId;

  @JsonIgnore
  @Transient
  String statusType; // not in db table
  int fallSpring;
  int semester;
  int maxSize;
  int minSize;
  int stakeholderId;

  @Column(columnDefinition = "TEXT")
  String description;
  String background;
  String technologies;
  String adminComments = "";
  String stakeholderCompany;

  public List<Student> getMembers() {
    return members;
  }

  public void setMembers(List<Student> members) {
    this.members = members;
  }

  public double getSum_p() {
    return sum_p;
  }

  public void setSum_p(double sum_p) {
    this.sum_p = sum_p;
  }

  public void incSum_p(int p) {
    this.sum_p = sum_p + p;
  }

  public double getP_max() {
    return p_max;
  }

  public void setP_max(double p_max) {
    this.p_max = p_max;
  }

  public double getN() {
    return n;
  }

  public void setN(double n) {
    this.n = n;
  }

  public void incN() {
    this.n = n + 1;
  }

  public double getC() {
    return c;
  }

  public void setC(double c) {
    this.c = c;
  }

  public double getPopularity() {
    return popularity;
  }

  public void setPopularity(double popularity) {
    this.popularity = popularity;
  }

  public double getProjSatScore() {
    return projSatScore;
  }

  public void setProjSatScore(double projSatScore) {
    this.projSatScore = projSatScore;
  }

  public Integer getProjectId() {
    return projectId;
  }

  public void setProjectId(Integer projectId) {
    this.projectId = projectId;
  }

  public String getProjectName() {
    return projectName;
  }

  public void setProjectName(String projectName) {
    this.projectName = projectName;
  }

  public int getStatusId() {
    return statusId;
  }

  public void setStatusId(int statusId) {
    this.statusId = statusId;
  }

  public String getStatusType() {
    return statusType;
  }

  public void setStatusType(String status) {
    switch (status) {
      case "1":
        this.statusType = "Pending Approval";
        break;

      case "2":
        this.statusType = "Approved";
        break;

      case "3":
        this.statusType = "Rejected";
        break;

      case "4":
        this.statusType = "Changes Requested";
        break;
    }
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

  public int getMaxSize() {
    return maxSize;
  }

  public void setMaxSize(int maxSize) {
    this.maxSize = maxSize;
  }

  public int getMinSize() {
    return minSize;
  }

  public void setMinSize(int minSize) {
    this.minSize = minSize;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getBackground() {
    return background;
  }

  public void setBackground(String background) {
    this.background = background;
  }

  public String getTechnologies() {
    return technologies;
  }

  public void setTechnologies(String technologies) {
    this.technologies = technologies;
  }

  public String getAdminComments() {
    return adminComments;
  }

  public void setAdminComments(String adminComments) {
    this.adminComments = adminComments;
  }

  public void setStakeholderId(int stakeholderId) {
    this.stakeholderId = stakeholderId;
  }

  public int getStakeholderId() {
    return this.stakeholderId;
  }

  public void setStakerholderCompany(String stakeholderCompany) {
    this.stakeholderCompany = stakeholderCompany;
  }

  public String getStakeholderCompany() {
    return this.stakeholderCompany;
  }

  // RANKING ALGORITHM FUNCTIONALITY:

  public Project(int _p_max) {
    members = new Vector<Student>();
    sum_p = 0;
    p_max = _p_max;
    n = 0;
    c = 10;
    popularity = 0;
  }

  public Project() {
    this.members = new ArrayList<Student>();
  }

  public Project(Project orig) {
    this.members = new ArrayList<Student>();
    for (Student s : orig.members) {
      this.members.add(new Student(s));
    }
    this.sum_p = orig.sum_p;
    this.p_max = orig.p_max;
    this.n = orig.n;
    this.c = orig.c;
    this.popularity = orig.popularity;
    this.projSatScore = orig.projSatScore;
    this.projectId = orig.projectId;
    this.projectName = orig.projectName;
    this.statusId = orig.statusId;
    this.minSize = orig.minSize;
    this.maxSize = orig.maxSize;
    this.fallSpring = orig.fallSpring;
    this.semester = orig.semester;
    this.stakeholderId = orig.stakeholderId;
    this.stakeholderCompany = orig.stakeholderCompany;
  }
  public double returnProjSatScore(List<Ranking> rankings) {
    double maxScore = ProjectAssignment.getStudentSatScore(1) * maxSize; // max score possible
    // System.out.println("p_max: " + p_max);
    // System.out.println("maxSize: " + maxSize);
    // System.out.println("maxScore: " + maxScore);
    System.out.println("proj id:" + getProjectId());
    double totalScore = 0;
    if (!members.isEmpty()) {
      for (Student student : members) {
        
        for (Ranking r : rankings) {
          if (r.getStudentId() == student.getId() && r.getProjectId() == this.projectId) {
            int ranking = r.getRank();
            totalScore += ProjectAssignment.getStudentSatScore(ranking);
            System.out.println("ranking: " + ranking);
            System.out.println("totalScore: " + totalScore);
          }
        }
        
        
      }
    }

    this.projSatScore = totalScore / maxScore;
    System.out.println("this. project sat score: " + this.projSatScore);
    return this.projSatScore;
  }

  public double returnPopularity() {
    double first = (2 * this.sum_p) / (this.n * this.p_max);
    double _popularity = (first + (this.n / this.c)) / 3;

    this.popularity = _popularity;
    return _popularity;
  }

  public String toString() {
    return ("Project #" + this.projectId + ": '" + this.projectName + "' | " + this.minSize + "-" + this.maxSize + " "
        + this.p_max);
  }

  public void printMembers() {
    for (Student s : this.members) {
      System.out.print(s.getFirstName() + " " + s.getLastName() + " ");
    }
    System.out.println("");
  }
  /* Comparator Stuff */

  @Override
		public int compareTo(Object o) {
			if (!(o instanceof Project))
				throw new ClassCastException();

			Project p = (Project) o;

			return (this.projectName).compareTo(p.projectName);
		}
		
		// sorts by popularity in descending order
		public static class popularityComparator implements Comparator {
			public int compare(Object o1, Object o2) {
				if (!(o1 instanceof Project) || !(o2 instanceof Project))
					throw new ClassCastException();
				
				Project p1 = (Project) o1;
				Project p2 = (Project) o2;
							
		        if (p1.returnPopularity() > p2.returnPopularity()) return -1;
		        else if (p1.returnPopularity() < p2.returnPopularity()) return 1;
		        else return 0;
			}
    }
    // sorts by min size in ascending order
		public static class openSpotsToMinSizeComparator implements Comparator {
			public int compare(Object o1, Object o2) {
				if (!(o1 instanceof Project) || !(o2 instanceof Project))
					throw new ClassCastException();
				
				Project p1 = (Project) o1;
				Project p2 = (Project) o2;
        int openSpots1 = p1.getMembers().size()-p1.getMinSize();
        int openSpots2 = p2.getMembers().size()-p2.getMinSize();
		        if (openSpots1 < openSpots2) return -1;
		        else if (openSpots1 > openSpots2) return 1;
		        else return 0;
			}
    }
    
    // sorts by min size in descending order
		public static class openSpotsToMaxSizeComparator implements Comparator {
			public int compare(Object o1, Object o2) {
				if (!(o1 instanceof Project) || !(o2 instanceof Project))
					throw new ClassCastException();
				
				Project p1 = (Project) o1;
				Project p2 = (Project) o2;
        
        int openSpots1 = p1.getMaxSize()-p1.getMembers().size();
        int openSpots2 = p2.getMaxSize()-p2.getMembers().size();
		        if (openSpots1 > openSpots2) return -1;
		        else if (openSpots1 < openSpots2) return 1;
		        else return 0;
			}
    }
    // sorts by name in ascending order
		public static class alphabeticalComparator implements Comparator {
			public int compare(Object o1, Object o2) {
				if (!(o1 instanceof Project) || !(o2 instanceof Project))
					throw new ClassCastException();
				
				Project p1 = (Project) o1;
				Project p2 = (Project) o2;
							
        if (p1.getProjectId() < p2.getProjectId()) return -1;
        else if (p1.getProjectId() > p2.getProjectId()) return 1;
        else return 0;
			}
    }
}