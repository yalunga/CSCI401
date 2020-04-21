package capstone.util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
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
  private ArrayList<Project> projects; // the projects included in this Project Assignment
  private ArrayList<Project> eliminatedProjects;
  private ArrayList<Student> students;
  private ArrayList<Student> unassignedStudents;
  private List<Ranking> rankings;
  private static int NUM_RANKED;
  private static String folder_name;
  public double algoSatScore = 0; // overall satisfaction of this matching

  public static int getStudentSatScore(int i) { // i = project's rank
    return (((NUM_RANKED - i + 1) * (NUM_RANKED - i)) / 2) + 1;
  }

  // Imports data from local text files, populates the database tables for
  // Projects, Users, and Project Rankings, and terminates the program.
  public void importDataLocallyAndPopulateDatabase() {

    // import projects from text file
    String line = null;
    try {
      BufferedReader projectsBR = new BufferedReader(new FileReader(folder_name + "/projects.txt"));

      while ((line = projectsBR.readLine()) != null) {
        String[] elements = line.split(" ");

        Project newProject = new Project(getStudentSatScore(1));
        System.out.println("new project student sat score: " + getStudentSatScore(1));
        newProject.setProjectName(elements[0]);
        newProject.setProjectId(projects.size()); // TODO: MAKE THIS DYNAMIC WITH AUTOINCREMENT
        newProject.setMinSize(Integer.parseInt(elements[1]));
        newProject.setMaxSize(Integer.parseInt(elements[2]));
        projects.add(newProject);

        // writer.println(newProject);
      }

      projectsBR.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
    // writer.println("");

    // import users and rankings from text file
    try {
      BufferedReader studentsBR = new BufferedReader(new FileReader(folder_name + "/rankings.txt"));

      while ((line = studentsBR.readLine()) != null) {
        String[] elements = line.split(" ");

        Student newStudent = new Student();
        newStudent.setFirstName(elements[0]);
        // newStudent.setStudentId(students.size());
        // newStudent.setUserId(students.size());

        /*
         * for (int rank = 1; rank <= NUM_RANKED; rank++) { // for the student's Top 3
         * projects... int projectId = Integer.parseInt(elements[rank]); Project
         * rankedProject = projects.get(projectId - 1); // !!! SUBTRACT 1, as the
         * ranking's indices skip 0 for readability
         * 
         * // add rankedProject to the Student data structure: String projectName =
         * rankedProject.getProjectName(); newStudent.rankings.put(projectName, rank);
         * newStudent.orderedRankings.add(projectName);
         * 
         * // popularity metrics: Integer p = getStudentSatScore(rank);
         * rankedProject.incSum_p(p); rankedProject.incN(); }
         */

        students.add(newStudent);
        // writer.println(newStudent);
      }

      // writer.println("");
      studentsBR.close();
    } catch (Exception e) {
      e.printStackTrace();
    }

    // populateProjectsTable();

    // populateUsersTable();

    // populateRankingsTable();

    System.out.println("DATABASE POPULATION COMPLETED. ENDING PROGRAM.");
    System.exit(0);

  }

  // populates vectors from SQL DB
  public void importDataFromDatabase() {
    unassignedStudents.clear();
    for (Project p : projects) {
      p.members.clear();
    }
    // projects
    // projects = driver.getProjectsTable();

    // for(Project p : projects) {
    // writer.print(p);
    // }
    // writer.println("");

    // rankings
    // HARDCODING 5 (for now)
    // int num_students = (driver.getRankingsTableCount()/5); // TODO: figure out
    // more intuitive way to configure this
    // students = driver.getUsersWithRankings(projects, num_students);

    // for(Student s : students) {
    // writer.print(s);
    // }
    // writer.println("");

    // calculate popularity metrics:
    /*
     * for (Student s : students) {
     * 
     * Iterator it = s.rankings.entrySet().iterator(); while (it.hasNext()) {
     * Map.Entry pair = (Map.Entry)it.next(); String projectName = (String)
     * pair.getKey(); int rank = (int) pair.getValue();
     * 
     * Project rankedProject = GetProjectWithName(projectName); Integer p =
     * getStudentSatScore(rank); rankedProject.incSum_p(p); rankedProject.incN(); }
     * }
     */

  }

  public ProjectAssignment(ArrayList<Project> projects, ArrayList<Student> students, List<Ranking> rankings) {
    this.projects = new ArrayList<Project>(projects);
    this.students = new ArrayList<Student>(students);
    this.rankings = rankings;
    this.unassignedStudents = new ArrayList<Student>();
  }

  public void run(int iteration, int _NUM_RANKED, String _folder_name) {
    System.out.println("projects.size(): " + projects.size());
    NUM_RANKED = _NUM_RANKED;
    System.out.println("p_max:" + getStudentSatScore(1));
    if (projects.size() < NUM_RANKED) {
      NUM_RANKED = projects.size();
      System.out.println(NUM_RANKED);
    }
    folder_name = _folder_name;

    // set up output text file for this iteration
    /*
     * String filename = folder_name + "/iterations/" + Integer.toString(iteration)
     * + ".txt"; try { writer = new PrintWriter(filename, "UTF-8"); } catch
     * (FileNotFoundException e) { e.printStackTrace(); } catch
     * (UnsupportedEncodingException e) { e.printStackTrace(); }
     */

    // init SQL connection
    // driver = new SQLDriver(NUM_RANKED);
    // driver.connect();

    // import data
    // projects = new Vector<Project>();
    // students = new Vector<Student>();

    // !!! KEEP COMMENTED UNLESS YOUR DATABASE IS EMPTY !!!
    // importDataLocallyAndPopulateDatabase();

    importDataFromDatabase();

    // calculate each project's popularity scores
    /*
     * System.out.println("Project Popularity Scores:b"); for (Project p : projects)
     * { System.out.println(p.getProjectName() + " " + p.returnPopularity()); }
     */

    // sort projects by popularity in descending order
    Collections.sort(projects, new Project.popularityComparator());

    AssignInitial();
    // PrintProjects();
    EliminateProjects();
    // PlaceUnassignedStudents();
    Bump();
    PlaceUnassignedStudents();
    FinalChecks();
    // PrintProjects();
    // JSONOutput();

    // calculate this iteration's overall sat score:
    double totalProjSatScores = 0;
    for (Project p : projects) {
      System.out.println("for loop");
      if (p != null && p.members.size() > 0) {
        // System.out.println("returnProjSatScore: " + p.returnProjSatScore());
        // totalProjSatScores += p.returnProjSatScore();
        System.out.println("returnProjSatScore: " + p.returnProjSatScore(rankings));
        totalProjSatScores += p.returnProjSatScore(rankings);
      }
    }
    System.out.println("totalProjSatScores: " + totalProjSatScores);
    algoSatScore = totalProjSatScores / projects.size();
    System.out.println("projects.size(): " + projects.size());
    System.out.print("Satisfaction: " + algoSatScore);
    // writer.close();

    // Clean up duplicate assignments
    PrintProjects();
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
    // String jsonStr = "[";
    String jsonStr = "[";
    ObjectMapper mapper = new ObjectMapper();
    for (int i = 0; i < projects.size(); i++) {
      try {
        // Writing to a file
        if (i != 0) {
          jsonStr += ",";
        }
        jsonStr += mapper.writeValueAsString(projects.get(i));
        // System.out.println(jsonStr);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    jsonStr += "]";
    return jsonStr;
  }

  void AssignInitial() {
    for (Student s : students) {
      System.out.println("ADDING UNASSIGNED STUDENT");
      unassignedStudents.add(s);
    }
    Collections.shuffle(unassignedStudents);
    ArrayList<Student> unassignedStudentsCopy = new ArrayList<Student>();
    for (int i = 0; i < unassignedStudents.size(); i++) {
      unassignedStudentsCopy.add(unassignedStudents.get(i));
    }
    for (int choice = 1; choice <= NUM_RANKED; choice++) {

      for (int i = 0; i < unassignedStudents.size(); i++) {
        Student s = unassignedStudents.get(i);

        Student sCopy = null;
        for (int j = 0; j < unassignedStudentsCopy.size(); j++) {
          if (s.getLastName() == unassignedStudentsCopy.get(j).getLastName()) {
            sCopy = unassignedStudentsCopy.get(j);
          }
        }
        System.out.println("Fetching rank repo using student ID: " + s.getUserId() + " and rank: " + choice);
        Ranking rank = null;
        for (Ranking r : rankings) {
          if (r.getStudentId() == s.getUserId() && r.getRank() == choice) {
            System.out.println("r.getRank(): " + r.getRank());
            rank = r;
          }
        }
        if (rank == null) {
          continue;
        }
        Project p = getProjectById(rank.getProjectId());
        System.out.println("student: " + s.getLastName() + ", project: " + p.getProjectId() + "rank: " + choice);
        if (p.members.size() < p.getMaxSize()) {
          System.out.println("ADDING NEW MEMBER");
          System.out.println(s.getLastName());
          (p.members).add(s);
          unassignedStudentsCopy.remove(sCopy);
        }

      }
      unassignedStudents.clear();
      System.out.println("unassignedStudentsCopy.size(): " + unassignedStudentsCopy.size());
      for (int i = 0; i < unassignedStudentsCopy.size(); i++) {
        System.out.println(unassignedStudentsCopy.get(i).getLastName() + " " + unassignedStudentsCopy.get(i));
        unassignedStudents.add(unassignedStudentsCopy.get(i));
      }
    }

    if (unassignedStudents.isEmpty())
      System.out.println("UNASSIGNED STUDENTS IS EMPTY");
  }

  void EliminateProjects() {
    eliminatedProjects = new ArrayList<Project>();
    for (int i = projects.size() - 1; i >= 0; i--) {
      Project p = projects.get(i);
      // && unassignedStudents.size() >= GetTotalMaxSpots()
      if (p.members.size() < p.getMinSize()) {
        System.out.println("Eliminated " + p.getProjectName());

        for (Student s : p.members) {
          if (!unassignedStudents.contains(s)) {
            System.out.println(s.getLastName() + " " + s);
            unassignedStudents.add(s);
          }
        }
        p.members.clear();

        eliminatedProjects.add(p);
        projects.remove(p);

      }
    }
    // writer.println("");
  }

  void Bump() {
	
    Collections.shuffle(unassignedStudents);
    for (Iterator<Student> it = unassignedStudents.iterator(); it.hasNext();) {
	  System.out.println("unassignedstudents size: " + unassignedStudents.size());
      System.out.println("BUMPING UNASSIGNED STUDENT");
      Student s = it.next();
      if (BumpHelper(s, 0, null, -1)) {
        it.remove();
      }
    }
  }

  boolean BumpHelper(Student s, int level, Project displacedProj, int indexOfDisplaced) {
    if (level > 3)
      return false;
    for (int i = 0; i < s.orderedRankings.size(); i++) {
      Project p = GetProjectWithName(s.orderedRankings.get(i));
      if (p != null && p.members.size() < p.getMaxSize() && !p.members.contains(s) && p != displacedProj
          && p.members.size() + 1 >= p.getMinSize()) { // found a spot for them
        System.out.println("ADDING " + s.getLastName() + " to project " + p.getProjectId());
        if (displacedProj != null)
          System.out.println("REMOVING " + displacedProj.members.get(indexOfDisplaced).getLastName() + " from project "
              + displacedProj.getProjectId());

        p.members.add(s);
        if (displacedProj != null)
          displacedProj.members.remove(indexOfDisplaced);
        return true;
      }
    }

    if (s.orderedRankings.size() <= 0) {
      return false;
    }

    Project p = GetProjectWithName(s.orderedRankings.get(0));

    if (p == null) {
      return false;
    }

    Random rand = new Random();
    int index = rand.nextInt(p.members.size());
    Student displaced = (p.members).get(index);

    if (p.members.size() - 1 >= p.getMinSize() && !p.members.contains(s)
        && BumpHelper(displaced, level + 1, p, index)) {
      System.out.println("BUMP HELPER IF STATEMENT");
      // if (!p.members.contains(s)) {
      // p.members.remove(displaced);
      System.out.println("ADDED " + s.getLastName() + " to project " + p.getProjectId());
      p.members.add(s);
      // }
      return true;
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
      Collections.sort(unassignedProjects, new Project.openSpotsToMinSizeComparator());
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
      Collections.sort(assignedProjects, new Project.openSpotsToMaxSizeComparator());
      List<Student> lastAssignedProjectMembers = lastAssignedProject.getMembers();
      int index = -1;
      for (Project p : assignedProjects) {
        while (index < lastAssignedProjectMembers.size() - 1) {
          index++;
          if (p.getMembers().size() < p.getMaxSize()) {
            p.getMembers().add(lastAssignedProjectMembers.get(index));
            unassignedStudents.remove(lastAssignedProjectMembers.get(index));
          } else {
            break;
          }
        }
      }
      lastAssignedProject.getMembers().clear();
    }
    Collections.sort(assignedProjects, new Project.openSpotsToMaxSizeComparator());
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

}