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
    Bump();
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
      }
    }
    // sorts the less than min projects ascending based on how many open spots to
    // min size they have (empty projects at back)
    Collections.sort(lessThanMinProjects, new Project.openSpotsToMinSizeAscendingComparator());
    for (Project p : lessThanMinProjects) {
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
        firstProject.members.add(unassignedStudents.get(0));
        unassignedStudents.remove(0);
      }
      // if we hit the min
      if (firstProject.members.size() == firstProject.getMinSize()) {
        hitTheMinProjects.add(firstProject);
        firstIndex++;
        numberOfStudents -= originalSize;
        if (unassignedStudents.size() > 0)
          continue;
      }
      // try other students
      while (firstProject.members.size() < firstProject.getMinSize() && numberOfStudents > 0
          && firstIndex < lastIndex) {
        Project lastProject = lessThanMinProjects.get(lastIndex);
        if (lastProject.members.size() > 0) {
          firstProject.members.add(lastProject.members.get(0));
          lastProject.members.remove(0);
          numberOfStudents--;
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
    // first try it with any unassigned students
    Collections.shuffle(unassignedStudents);
    for (Iterator<Student> it = unassignedStudents.iterator(); it.hasNext();) {
      Student s = it.next();
      if (BumpHelper(s, 0, null, -1)) {
        it.remove();
      }
    }
    // then try with students who do not have their 1st-NUM_RANKEDth choices
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
    Collections.shuffle(assignedStudents);
    for (Iterator<Student> it = assignedStudents.iterator(); it.hasNext();) {
      Student s = it.next();
      Project p = studentToProject.get(s);
      if (BumpHelper(s, 0, p, -1)) {
        it.remove();
      }
    }
  }

  boolean BumpHelper(Student s, int level, Project displacedProj, int indexOfDisplaced) {
    if (level > 3)
      return false;
    // if their top choice has space for them
    int projectId = s.orderedRankings.get(0);
    Project p = getProjectById(projectId);
    if (p != null) {
      // try to just add them to the project
      if (p != null && p.members.size() < p.getMaxSize() && !p.members.contains(s) && p != displacedProj
          && p.members.size() >= p.getMinSize()) { // found a spot for them
        boolean add = (displacedProj == null) || (displacedProj.members.size() > displacedProj.getMinSize());
        if (add)
          p.members.add(s);
        if (add && displacedProj != null) {
          displacedProj.members.remove(s);
        }
        return true;
      }
      // try to bump someone out
      else if (p != null && p.members.size() == p.getMaxSize() && !p.members.contains(s) && p != displacedProj
          && p.members.size() >= p.getMinSize()) { // need to bump someone out
        Random rand = new Random();
        int index = rand.nextInt(p.members.size());
        Student displaced = (p.members).get(index);
        if (p.members.size() > p.getMinSize() && !p.members.contains(s) && BumpHelper(displaced, level + 1, p, index)) {
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
    // random assign if its the last level of recursion
    return false;
  }

  // place unassigned students
  void PlaceUnassignedStudents() {
    Collections.shuffle(unassignedStudents);
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
        ArrayList<Student> unassignedStudentsCopy = new ArrayList<Student>();
        for (int i = 0; i < unassignedStudents.size(); i++) {
          unassignedStudentsCopy.add(unassignedStudents.get(i));
        }
        for (it = unassignedStudents.iterator(); it.hasNext();) {
          Student s = it.next();
          if (p.members.size() < p.getMinSize()) {
            p.members.add(s);
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
        System.out.println(p.getProjectId() + " members are less than min.");
        badProjects.add(p);
      } else if (p.getMembers().size() > p.getMaxSize()) {
        System.out.println(p.getProjectId() + " members are greater than max.");
        badProjects.add(p);
      }
      for (Student s : p.getMembers()) {
        if (duplicateStudents.contains(s)) {
          System.out.println(p.getProjectId() + " has duplicate students.");
          badProjects.add(p);
        } else {
          duplicateStudents.add(s);
        }
      }
    }
    if (badProjects.isEmpty())
      System.out.println("Final checks passed!");

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


  public List<Project> assignedProjects() {
    return projects;
  }

  // returns a Student's satsifaction score
  public static int getStudentSatScore(int i) { // i = project's rank, 1-indexed based
    return (((NUM_RANKED - i + 1) * (NUM_RANKED - i)) / 2) + 1; // formula to figure out a Student's satisfaction score
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