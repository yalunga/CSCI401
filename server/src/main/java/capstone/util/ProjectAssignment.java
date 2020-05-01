package capstone.util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.model.Project;
import capstone.model.Ranking;
import capstone.model.users.Student;
import capstone.service.ProjectService;

public class ProjectAssignment {
  private ArrayList<Project> projects; // projects included in this ProjectAssignment
  private ArrayList<Project> eliminatedProjects; // projects that have been eliminated in EliminateProjects()
  private ArrayList<Student> students; // students included in this ProjectAssignment
  private ArrayList<Student> unassignedStudents; // unassigned students at any given time
  private List<Ranking> rankings; // rankings that Students have for Projects
  private static int NUM_RANKED; // number of rankings a student should have
  private static String folder_name; // folder used for local testing
  public double algoSatScore = 0; // overall satisfaction of this matching

  public ProjectAssignment(ArrayList<Project> projects, ArrayList<Student> students, List<Ranking> rankings) {
    this.projects = new ArrayList<Project>(projects);
    this.students = new ArrayList<Student>(students);
    this.rankings = new ArrayList<Ranking>(rankings);
    int i = 1;
    for (Ranking rank : this.rankings) {
      System.out.println("ranking " + i + ": choice " + rank.getRank() + " student " + rank.getStudentId()
          + ", project: " + rank.getProjectId());
      i++;
    }
    this.unassignedStudents = new ArrayList<Student>();

  }

  // runs the algorithm
  public void run(int iteration, int _NUM_RANKED, String _folder_name) {
    NUM_RANKED = _NUM_RANKED;
    if (projects.size() < NUM_RANKED) {
      NUM_RANKED = projects.size();
    }
    folder_name = _folder_name;
    Reset();
    AssignInitial();
    EliminateProjects();
    //Bump();
    PlaceUnassignedStudents();
    FinalChecks();

    // calculate this iteration's overall sat score:
    double totalProjSatScores = 0;
    for (Project p : projects) {
      if (p != null && p.members.size() > 0) {
        totalProjSatScores += p.returnProjSatScore(rankings);
      }
    }
    algoSatScore = totalProjSatScores / projects.size();

    PrintProjects();
  }

  // resets certain members
  public void Reset() {
    unassignedStudents.clear();
    for (Project p : projects) {
      p.members.clear();
    }
    for (Student s : students) {
      s.orderedRankings.clear();
      for (int choice = 1; choice <= NUM_RANKED; choice++) {
        for (Ranking r : rankings) {
          if (r.getStudentId().equals(s.getUserId()) && r.getRank() == choice) {
            int projectId = r.getProjectId();
            Project p = getProjectById(projectId);
            s.orderedRankings.add(projectId);
          }
        }
      }
    }
  }

  // Greedily assign random students to their 1st-NUM_RANKEDth choices
  void AssignInitial() {
    // add all students to unassigned students
    for (Student s : students) {
      unassignedStudents.add(s);
    }
    // shuffle
    Collections.shuffle(unassignedStudents);
    // deep copy for concurrent modification
    ArrayList<Student> unassignedStudentsCopy = new ArrayList<Student>();
    for (int i = 0; i < unassignedStudents.size(); i++) {
      unassignedStudentsCopy.add(unassignedStudents.get(i));
    }
    // iterate through all choices

    for (int choice = 1; choice <= NUM_RANKED; choice++) {
      // iterate through all students
      for (int i = 0; i < unassignedStudents.size(); i++) {
        Student s = unassignedStudents.get(i);
        // used to remove it in deep copy
        Student sCopy = null;
        for (int j = 0; j < unassignedStudentsCopy.size(); j++) {
          if (s.getUserId() == unassignedStudentsCopy.get(j).getUserId()) {
            sCopy = unassignedStudentsCopy.get(j);
          }
        }
        // get the ranking for the student
        Ranking rank = null;
        for (Ranking r : rankings) {
          if (r.getStudentId().equals(s.getUserId()) && r.getRank() == choice) {
            rank = r;
          }
        }
        if (rank == null) {
          continue;
        }
        Project p = getProjectById(rank.getProjectId());
        // add as long as there is still room, add the student
        if (p.members.size() < p.getMaxSize()) {
          (p.members).add(s);
          unassignedStudentsCopy.remove(sCopy);
        }
      }
      // deep copy
      unassignedStudents.clear();
      for (int i = 0; i < unassignedStudentsCopy.size(); i++) {
        unassignedStudents.add(unassignedStudentsCopy.get(i));
      }
    }
  }

  // Reassign students on projects with less than min size and eliminate any
  // projects with no members
  void EliminateProjects() {
    // projects with less than min size
    ArrayList<Project> lessThanMinProjects = new ArrayList<Project>();
    // number of students who are on projects with less than the min
    int numberOfStudents = 0;
    for (Project p : projects) {
      if (p.members.size() < p.getMinSize()) {
        lessThanMinProjects.add(p);
        numberOfStudents += p.members.size();
        for (Student s : p.members)
          System.out.println("STUDENT " + s.getUserId());
      }
    }
    System.out.println("NUMBER OF STUDENTS: " + numberOfStudents);
    // sorts the less than min projects ascending based on how many open spots to
    // min size they have (empty projects at back)
    Collections.sort(lessThanMinProjects, new Project.openSpotsToMinSizeAscendingComparator());
    for (Project p : lessThanMinProjects) {
      System.out.println("project id: " + p.getProjectId());
      System.out.println("min size: " + p.getMinSize());
      System.out.println("members size: " + p.getMembers().size());
    }
    // projects that have hit the min
    ArrayList<Project> hitTheMinProjects = new ArrayList<Project>();
    // assigns based on that priority
    int firstIndex = 0;
    int lastIndex = lessThanMinProjects.size() - 1;
    Project firstProject = null;
    // iterate while there are still projects that are less than the min
    while (firstIndex < lastIndex && numberOfStudents > 0) {
      firstProject = lessThanMinProjects.get(firstIndex);
      
      // how many students were on the projects
      int originalSize = firstProject.members.size();
      // first try using unassigned students
      while (firstProject.members.size() < firstProject.getMinSize() && unassignedStudents.size() > 0) {
        System.out.println("ADDING UNASSIGNED STUDENT " + unassignedStudents.get(0).getUserId() + " TO PROJECT " + firstProject.getProjectId());
        System.out.println("MIN SIZE: " + firstProject.getMinSize());
        System.out.println("MEMBERS SIZE: " + firstProject.getMembers().size());
        firstProject.members.add(unassignedStudents.get(0));
        unassignedStudents.remove(0);
      }
      // if we hit the min
      if (firstProject.members.size() == firstProject.getMinSize()) {
        hitTheMinProjects.add(firstProject);
        firstIndex++;
        numberOfStudents -= originalSize;
        System.out.println("NUMBER OF STUDENTS-=: " + numberOfStudents);
        if (unassignedStudents.size() > 0)
          continue;
      }
      // try other students
      while (firstProject.members.size() < firstProject.getMinSize() && numberOfStudents > 0
          && firstIndex < lastIndex) {
        Project lastProject = lessThanMinProjects.get(lastIndex);
        if (lastProject.members.size() > 0) {
          System.out.println("LAST PROJECT SIZE" + lastProject.members.size());
          System.out.println("ADDING STUDENT " + lastProject.members.get(0).getUserId() + " FROM PROJECT " + lastProject.getProjectId() + " TO PROJECT " + firstProject.getProjectId());
          System.out.println("MIN SIZE: " + firstProject.getMinSize());
          System.out.println("MEMBERS SIZE: " + firstProject.getMembers().size());
          firstProject.members.add(lastProject.members.get(0));
          lastProject.members.remove(0);
          numberOfStudents--;
          System.out.println("NUMBER OF STUDENTS--: " + numberOfStudents);
        } else {
          lastIndex--;
        }
        // if we hit the min
        if (firstProject.members.size() == firstProject.getMinSize()) {
          hitTheMinProjects.add(firstProject);
          firstIndex++;
          numberOfStudents -= originalSize;
          break;
        }
      }
    }
    PrintProjects();
    System.out.println("NUMBER OF STUDENTS: " + numberOfStudents);
    // if we were able to assign all students that were on less than min projects
    if (numberOfStudents == 0) {
      System.out.println("WE WERE ABLE TO ASSIGN ALL STUDENTS");
      System.out.println("firstProject.getProjectId(): " + firstProject.getProjectId());
      System.out.println("firstProject.members.size(): " + firstProject.members.size());
      System.out.println("firstProject.getMinSize(): " + firstProject.getMinSize());
      // but the last project we assigned is less than min
      // if (firstProject.members.size() > 0 && firstProject.members.size() < firstProject.getMinSize()) {
      //   // sort by open spots to max size descending order
      //   Collections.sort(hitTheMinProjects, new Project.openSpotsToMaxSizeDescendingComparator());
      //   // how many we need to reassign
      //   int numberLessThanMin = firstProject.members.size();
      //   int hitsTheMinIndex = 0;
      //   // iterate through all projects that hit the min
      //   while (numberLessThanMin > 0 && hitsTheMinIndex < hitTheMinProjects.size()) {
      //     Project p = hitTheMinProjects.get(hitsTheMinIndex);
      //     if (p.members.size() < p.getMaxSize() && firstProject.members.size() > 0) {
      //       p.members.add(firstProject.members.get(0));
      //       firstProject.members.remove(0);
      //       numberLessThanMin--;
      //     } else {
      //       hitsTheMinIndex++;
      //     }
      //   }
      //   // if we exhausted all potential hitTheMin projects but we weren't able to
      //   // assign all students from the last project
      //   if (numberLessThanMin > 0) {
      //     System.out.println("NUMBER LESS THAN MIN!");
      //     for (Student s : firstProject.getMembers()) {
      //       unassignedStudents.add(s);
      //       numberOfStudents++;
      //     }
      //   } else {
      //     firstIndex++;
      //   }
      // }
    }

    eliminatedProjects = new ArrayList<Project>();
    // these students were unable to get their desired projects, so we need to leave
    // them as unassigned students and eliminate their projects
    if (numberOfStudents > 0) {
      int addIndex = firstIndex;
      while (addIndex < lessThanMinProjects.size()) {
        Project eliminated = lessThanMinProjects.get(addIndex);
        for (Student s : eliminated.getMembers()) {
          unassignedStudents.add(s);
        }
        eliminated.members.clear();
        eliminatedProjects.add(lessThanMinProjects.get(addIndex));
        addIndex++;
      }
    }

    // assign any unassigned students to projects that still have room
    ArrayList<Project> stillHasRoom = new ArrayList<Project>();
    for (Project p : projects) {
      if (p.getMembers().size() >= p.getMinSize() && p.getMembers().size() < p.getMaxSize())
        stillHasRoom.add(p);
    }
    for (Project p : stillHasRoom) {
      while (p.getMembers().size() < p.getMaxSize() && unassignedStudents.size() > 0) {
        p.members.add(unassignedStudents.get(0));
        unassignedStudents.remove(0);
      }
    }
    // still have unassigned students, but we let Bump and placeUnassignedStudents
    // take care of it
  }

  // attempts bumping someone out of their spot
  void Bump() {

    Collections.shuffle(unassignedStudents);
    HashMap<Student, Project> studentToProject = new HashMap<Student, Project>();
    ArrayList<Student> assignedStudents = new ArrayList<Student>();
    for (Project p : projects) {
      for (Student s : p.members) {
        if (!s.orderedRankings.contains(p.getProjectId())) {
          studentToProject.put(s, p);
          assignedStudents.add(s);
        }
      }
    }

    for (Iterator<Student> it = unassignedStudents.iterator(); it.hasNext();) {
      System.out.println("unassignedstudents size: " + unassignedStudents.size());
      Student s = it.next();
      System.out.println("BUMPING UNASSIGNED STUDENT " + s.getUserId());

      if (BumpHelper(s, 0, null, -1)) {
        it.remove();
      }
    }

    Collections.shuffle(assignedStudents);
    int i = 0;
    for (Iterator<Student> it = assignedStudents.iterator(); it.hasNext() && i < 10;) {
      System.out.println("assignedstudents size: " + assignedStudents.size());
      Student s = it.next();
      System.out.println("BUMPING ASSIGNED STUDENT " + s.getUserId());
      Project p = studentToProject.get(s);
      if (BumpHelper(s, 0, p, -1)) {
        it.remove();
      }
      i++;
    }

  }

  boolean BumpHelper(Student s, int level, Project displacedProj, int indexOfDisplaced) {
    if (level > 3)
      return false;
    System.out.println("LEVEL" + level);
    System.out.println("s.orderedRankings.size: " + s.orderedRankings.size());

    // if there is space for their top 5
    // for (int i = 0; i < s.orderedRankings.size(); i++) {
    System.out.println("there is space for their top 5?");
    int projectId = s.orderedRankings.get(0);
    // System.out.println("project id: " + projectId);
    Project p1 = null;
    for (int i = 0; i < projects.size(); i++) {
      System.out.println(projects.get(i).getProjectId());
      if (projects.get(i).getProjectId().equals(projectId)) {
        p1 = projects.get(i);
      }
    }
    // String projectName = p.getProjectName();
    if (p1 != null) {
      int pid = p1.getProjectId();
      System.out.println("Project id: " + pid);
      // Project p1 = getProjectById((int)s.orderedRankings.get(0));

      System.out.println("project: " + p1.getProjectId());
      System.out.println("project members size: " + p1.members.size());
      System.out.println("project max size: " + p1.getMaxSize());
      System.out.println("does p contain s: " + p1.members.contains(s));
      if (displacedProj != null)
        System.out.println("displaced project: " + displacedProj.getProjectId());
      System.out.println("student " + s.getUserId());
      if (p1 != null && p1.members.size() < p1.getMaxSize() && !p1.members.contains(s) && p1 != displacedProj
          && p1.members.size() >= p1.getMinSize()) { // found a
        // spot for
        // them
        System.out.println("ADDING " + s.getLastName() + " to project " + p1.getProjectId());
        boolean add = (displacedProj == null) || (displacedProj.members.size() > displacedProj.getMinSize());
        if (add)
          p1.members.add(s);
        if (add && displacedProj != null) {
          displacedProj.members.remove(s);
        }
        return true;
      }
    }
    // }
    // if we need to bump someone out
    // for (int i = 0; i < s.orderedRankings.size(); i++) {
    System.out.println("there is NOT space for their top 5?");
    Project p = getProjectById(s.orderedRankings.get(0));
    if (p != null) {
      System.out.println("project: " + p.getProjectId());
      System.out.println("project members size: " + p.members.size());
      System.out.println("project max size: " + p.getMaxSize());
      System.out.println("does p contain s: " + p.members.contains(s));
      if (displacedProj != null)
        System.out.println("displaced project: " + displacedProj.getProjectId());
      System.out.println("student " + s.getUserId());
      // roject p = GetProjectWithName(s.orderedRankings.get(i));
      if (p != null && p.members.size() == p.getMaxSize() && !p.members.contains(s) && p != displacedProj
          && p.members.size() >= p.getMinSize()) {
        Random rand = new Random();
        int index = rand.nextInt(p.members.size());
        Student displaced = (p.members).get(index);
        if (p.members.size() > p.getMinSize() && !p.members.contains(s) && BumpHelper(displaced, level + 1, p, index)) {
          System.out.println("BUMP HELPER IF STATEMENT");
          System.out.println("ADDED " + s.getLastName() + " to project " + p.getProjectId());
          boolean add = (displacedProj == null) || (displacedProj.members.size() > displacedProj.getMinSize());
          if (add)
            p.members.add(s);
          if (add && displacedProj != null) {
            displacedProj.members.remove(s);
          }
          return true;
        }
      }
    }
    return false;
  }

  Project GetProjectWithName(String projname) {
    for (int j = 0; j < projects.size(); j++) {
      if (projects.get(j).getProjectName().equals(projname))
        return projects.get(j);
    }
    return null;
  }

  Project getProjectById(int id) {
    for (int i = 0; i < projects.size(); i++) {
      if (projects.get(i).getProjectId() == id) {
        return projects.get(i);
      }
    }
    return null;
  }

  int GetTotalMaxSpots() {
    int maxspots = 0;
    for (Project p : projects)
      maxspots += p.getMaxSize() - p.members.size();
    return maxspots;
  }

  boolean CanStop() { // assignment is satisfactory
    int numstudents = 0;
    for (Project p : projects) {
      if (!p.members.isEmpty() && (p.members.size() < p.getMinSize() || p.members.size() > p.getMaxSize()))
        return false;
      numstudents += p.members.size();
    }
    if (numstudents != students.size())
      return false;
    return true;
  }

  void PlaceUnassignedStudents() {
    Collections.shuffle(unassignedStudents);
    System.out.println("PLACE UNASSIGNED STUDENTS: " + unassignedStudents.size());
    ArrayList<Project> unassignedProjects = new ArrayList<Project>();
    ArrayList<Project> assignedProjects = new ArrayList<Project>();
    Iterator<Student> it = unassignedStudents.iterator();
    Project lastAssignedProject = null;
    while (unassignedStudents.size() > 0) {
      for (Project p : projects) {
        if (p.members.size() < p.getMinSize()) {
          unassignedProjects.add(p);
        }
      }
      for (Project p : eliminatedProjects) {
        projects.add(p);
        unassignedProjects.add(p);
      }
      Collections.sort(unassignedProjects, new Project.openSpotsToMinSizeAscendingComparator());
      for (Project p : unassignedProjects) {
        System.out.println("SORTED UNASSIGNED PROJECTS MIN SIZE");

        System.out.println("Members: " + p.getMembers().size());
        System.out.println("Min size: " + p.getMinSize());

      }
      for (Project p : unassignedProjects) {
        ArrayList<Student> unassignedStudentsCopy = new ArrayList<Student>();
        for (int i = 0; i < unassignedStudents.size(); i++) {
          unassignedStudentsCopy.add(unassignedStudents.get(i));
        }
        for (it = unassignedStudents.iterator(); it.hasNext();) {
          Student s = it.next();
          System.out.println("UNASSIGNED STUDENT " + s.getUserId());
          if (p.members.size() < p.getMinSize()) {
            p.members.add(s);
            System.out.println("ADDING " + s.getUserId() + " TO PROJECT " + p.getProjectId());
            unassignedStudentsCopy.remove(s);
            lastAssignedProject = p;
          } else {
            assignedProjects.add(p);
            break;
          }
        }
        unassignedStudents.clear();
        for (int i = 0; i < unassignedStudentsCopy.size(); i++) {
          unassignedStudents.add(unassignedStudentsCopy.get(i));
        }
        unassignedStudentsCopy.clear();
      }
    }
    // weren't able to fill the min size for the last project we assigned
    if (lastAssignedProject != null && lastAssignedProject.getMembers().size() < lastAssignedProject.getMinSize()) {
      Collections.sort(assignedProjects, new Project.openSpotsToMaxSizeDescendingComparator());
      List<Student> lastAssignedProjectMembers = lastAssignedProject.getMembers();
      int index = -1;
      for (Project p : assignedProjects) {
        while (index < lastAssignedProjectMembers.size() - 1) {
          index++;
          if (p.getMembers().size() < p.getMaxSize()) {
            System.out.println("LAST ASSXIGNED PROJECT ADDING " + lastAssignedProjectMembers.get(index).getUserId()
                + " TO PROJECT " + p.getProjectId());
            p.getMembers().add(lastAssignedProjectMembers.get(index));
            unassignedStudents.remove(lastAssignedProjectMembers.get(index));
          } else {
            index--;
            break;
          }
        }
      }
      lastAssignedProject.getMembers().clear();
    }
    Collections.sort(assignedProjects, new Project.openSpotsToMaxSizeDescendingComparator());
    // weren't able to assign everyone
    for (Project p : assignedProjects) {
      while (it.hasNext()) {
        Student s = it.next();
        if (p.getMembers().size() < p.getMaxSize()) {
          p.getMembers().add(s);
        } else {
          break;
        }
      }
    }

    for (int i = projects.size() - 1; i >= 0; i--) {
      Project p = projects.get(i);
      if (p.members.size() == 0) {
        System.out.println("Eliminated " + p.getProjectName());
        projects.remove(i);

      }
    }
  }

  void FinalChecks() {
    System.out.println("Final Checks:");
    ArrayList<Project> badProjects = new ArrayList<Project>();
    ArrayList<Student> duplicateStudents = new ArrayList<Student>();
    if (unassignedStudents.size() > 0)
      System.out.println("There are unassigned students.");
    for (Project p : projects) {
      if (p.getMembers().size() < p.getMinSize()) {
        System.out.println(p.getProjectId() + "members are less than min.");
        badProjects.add(p);
      } else if (p.getMembers().size() > p.getMaxSize()) {
        System.out.println(p.getProjectId() + "members are greater than max.");
        badProjects.add(p);
      }
      for (Student s : p.getMembers()) {
        if (duplicateStudents.contains(s)) {
          System.out.println(p.getProjectId() + "has duplicate students.");
          badProjects.add(p);
        } else {
          duplicateStudents.add(s);
        }
      }
    }
    if (badProjects.isEmpty())
      System.out.println("Final checks passed!");

  }

  public List<Project> assignedProjects() {
    return projects;
  }

  // returns a Student's satsifaction score
  public static int getStudentSatScore(int i) { // i = project's rank, 1-indexed based
    return (((NUM_RANKED - i + 1) * (NUM_RANKED - i)) / 2) + 1; // formula to figure out a Student's satisfaction score
  }

  void PrintProjects() {
    ArrayList<Long> orderedStudents = new ArrayList<Long>();
    System.out.println("Projects: ");
    for (Project p : projects) {
      System.out.print(p.getProjectName() + " ");
      p.printMembers();
      for (Student s : p.getMembers())
        orderedStudents.add(s.getUserId());
    }
    Collections.sort(orderedStudents);
    System.out.println("unassigned students size: " + unassignedStudents.size());
    for (Long l : orderedStudents) {
      System.out.print(l + " ");
      if (l % 10 == 0)
        System.out.println("");
    }
    System.out.println("");
  }

  /*
   * void JSONOutput() { //outputs JSON of each project ObjectMapper mapper = new
   * ObjectMapper(); for (int i=0; i<projects.size(); i++) { try { // Writing to a
   * file mapper.writeValue(new File("src/json/project"+i+".json"),
   * projects.elementAt(i)); // String jsonStr =
   * mapper.writeValueAsString(projects.elementAt(i)); //
   * System.out.println(jsonStr); } catch (IOException e) { e.printStackTrace(); }
   * } }
   */
  public String JSONOutputWeb() {
    String jsonStr = "[";
    ObjectMapper mapper = new ObjectMapper();
    for (int i = 0; i < projects.size(); i++) {
      try {
        // Writing to a file
        if (i != 0) {
          jsonStr += ",";
        }
        jsonStr += mapper.writeValueAsString(projects.get(i));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    jsonStr += "]";
    return jsonStr;
  }
}