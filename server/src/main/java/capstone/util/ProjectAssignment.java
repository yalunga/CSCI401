package capstone.util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
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
    System.out.println("rankings size: " + rankings.size());
    for (Ranking r : rankings) {
      System.out.println("Rank " + r.getRank() + " for student " + r.getStudentId() + " for project " + r.getProjectId());
    }
    System.out.println("students size: " + students.size());
    for (Student s: students) {
      s.orderedRankings.clear();
      //System.out.println("student " + s.getUserId() + "!");
      for (int choice = 1; choice <= NUM_RANKED; choice++) {
        for (Ranking r : rankings) {
          // System.out.println("Rank " + r.getRank() + " for student " + r.getStudentId() + " for project " + r.getProjectId());
          // System.out.println("choice " + choice);
          // System.out.println("r.getStudentId() == s.getUserId(): " + (r.getStudentId().equals(s.getUserId())));
          // System.out.println("r.getRank() == choice: " + (r.getRank() == choice));
          if (r.getStudentId().equals(s.getUserId()) && r.getRank() == choice) {
            int projectId = r.getProjectId();
            Project p = null;
            for (int i = 0; i < projects.size(); i++) {
              if (projects.get(i).getProjectId() == projectId) {
                p = projects.get(i);
              }
            }
            String projectName = p.getProjectName();
            System.out.println("ADDING " + projectName + " tO STUDENT " + s.getUserId() + " ORDERED RANKING for choice " + choice);
            s.orderedRankings.add(projectName);
          }  
        }
      }
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
    System.out.println("students size: " + this.students.size());
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
    // Collections.sort(projects, new Project.popularityComparator());

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
    ArrayList<Project> lessThanMinProjects = new ArrayList<Project>();
    int numberOfStudents = 0;
    for (int i = projects.size() - 1; i >= 0; i--) {
      Project p = projects.get(i);
      // && unassignedStudents.size() >= GetTotalMaxSpots()
      if (p.members.size() < p.getMinSize()) {
        lessThanMinProjects.add(p);
        numberOfStudents += p.members.size();
        // projects.remove(p);
      }
    }
    Collections.sort(lessThanMinProjects, new Project.openSpotsToMinSizeComparator());
    int firstIndex = 0;
    int lastIndex = lessThanMinProjects.size() - 1;
    Project firstProject = null;
    ArrayList<Project> hitsTheMinProjects = new ArrayList<Project>();
    while (firstIndex < lastIndex && numberOfStudents > 0) {
      System.out.println("first index " + firstIndex);
      System.out.println("last index " + lastIndex);
      firstProject = lessThanMinProjects.get(firstIndex);
      while (firstProject.members.size() < firstProject.getMinSize() && numberOfStudents > 0) {
        System.out.println("firstProject.members.size(): " + firstProject.members.size());
        System.out.println("firstProject.getMinSize(): " + firstProject.getMinSize());
        Project lastProject = lessThanMinProjects.get(lastIndex);
        if (lastProject.members.size() > 0) {
          System.out.println("last project.members.size(): " + lastProject.members.size());
          firstProject.members.add(lastProject.members.get(0));
          unassignedStudents.remove(lastProject.members.get(0));
          lastProject.members.remove(0);
          numberOfStudents--;
        } else {
          lastIndex--;
        }
      }
      if (firstProject.members.size() == firstProject.getMinSize()) {
        hitsTheMinProjects.add(firstProject);
        firstIndex++;
      }
    }
    if (numberOfStudents == 0) {
      // less than min
      if (firstProject.members.size() > 0 && firstProject.members.size() < firstProject.getMinSize()) {
        Collections.sort(hitsTheMinProjects, new Project.openSpotsToMaxSizeComparator());
        int numberLessThanMin = firstProject.members.size();
        int hitsTheMinIndex = 0;
        while (numberLessThanMin > 0 && hitsTheMinIndex < hitsTheMinProjects.size()) {
          Project p = hitsTheMinProjects.get(hitsTheMinIndex);
          if (p.members.size() < p.getMaxSize() && firstProject.members.size() > 0) {
            System.out.println("p project.members.size(): " + p.members.size());
            p.members.add(firstProject.members.get(0));
            unassignedStudents.remove(firstProject.members.get(0));
            firstProject.members.remove(0);
            numberLessThanMin--;
          } else {
            hitsTheMinIndex++;
          }
        }
        // exhausted all potential hitTheMin projects
        if (numberLessThanMin > 0) {
          for (Student s : firstProject.getMembers()) {
            unassignedStudents.add(s);
            numberOfStudents++;
          }
        } else {
          firstIndex++;
        }
      }
    }
    eliminatedProjects = new ArrayList<Project>();
    ArrayList<Project> unwantedProjects = new ArrayList<Project>();
    // we need to assign to empty projects
    if (numberOfStudents > 0) {

      System.out.println("numberOfStudents: " + numberOfStudents);
      int addIndex = firstIndex;

      while (addIndex < lessThanMinProjects.size()) {
        unwantedProjects.add(lessThanMinProjects.get(addIndex));
        addIndex++;
      }
      Collections.sort(unwantedProjects, new Project.openSpotsToMaxSizeComparator());
      Collections.shuffle(unassignedStudents);
      int unwantedIndex = 0;
      // int studentIndex = 0;
      Project unwantedProject = null;
      ArrayList<Project> unwantedHitTheMin = new ArrayList<Project>();
      while (unwantedIndex < unwantedProjects.size() && numberOfStudents > 0) {
        unwantedProject = unwantedProjects.get(unwantedIndex);
        while (unwantedProject.members.size() < unwantedProject.getMaxSize() && numberOfStudents > 0) {
          System.out.println("remove 0 unassigned students size: " + unassignedStudents.size());
          unwantedProject.members.add(unassignedStudents.get(0));
          unassignedStudents.remove(0);
          System.out.println("remove 0 unassigned students size: " + unassignedStudents.size());
          numberOfStudents--;
        }
        if (unwantedProject.members.size() == unwantedProject.getMaxSize()) {
          unwantedHitTheMin.add(unwantedProject);
          unwantedIndex++;
        }
        unwantedIndex++;
      }
      // the last project we assigned did not hit the min
      if (unwantedProject.members.size() < unwantedProject.getMinSize()) {
        int numNeeded = unwantedProject.getMinSize() - unwantedProject.members.size();
        Collections.sort(unwantedHitTheMin, new Project.openSpotsToMinSizeComparator());
        int idx = unwantedHitTheMin.size() - 1;
        while (numNeeded > 0 && idx >= 0) {
          Project takingFrom = unwantedHitTheMin.get(idx);
          while (takingFrom.members.size() > takingFrom.getMinSize() && numNeeded > 0) {
            Student removed = takingFrom.members.get(takingFrom.members.size() - 1);
            unwantedProject.members.add(removed);
            takingFrom.members.remove(removed);
            numNeeded--;
          }
          if (takingFrom.members.size() == takingFrom.getMinSize())
            idx--;
        }
        if (numNeeded == 0)
          unwantedIndex++;
      }
      while (unwantedIndex < unwantedProjects.size()) {
        Project eliminated = unwantedProjects.get(unwantedIndex);
        eliminatedProjects.add(eliminated);
        System.out.println("Eliminated " + eliminated.getProjectName());
        projects.remove(eliminated);
        unwantedIndex++;
      }
    }
    // if (numberOfStudents == 0) unassignedStudents.clear();
    System.out.println("NUMBER OF STUDENTS: " + numberOfStudents);
    System.out.println("UNASSIGNED STUDENTS SIZE: " + unassignedStudents.size());
  }

  void Bump() {

    Collections.shuffle(unassignedStudents);
    for (Iterator<Student> it = unassignedStudents.iterator(); it.hasNext();) {
      System.out.println("unassignedstudents size: " + unassignedStudents.size());
      Student s = it.next();
      System.out.println("BUMPING UNASSIGNED STUDENT " + s.getUserId());

      
      if (BumpHelper(s, 0, null, -1)) {
        it.remove();
      }
    }
  }

  boolean BumpHelper(Student s, int level, Project displacedProj, int indexOfDisplaced) {
    if (level > 3)
      return false;
    System.out.println("LEVEL" + level);
    System.out.println("s.orderedRankings.size: " + s.orderedRankings.size());
    
    // if there is space for their top 5
    for (int i = 0; i < s.orderedRankings.size(); i++) {
      System.out.println("there is space for their top 5?");
      Project p = GetProjectWithName(s.orderedRankings.get(i));
      System.out.println("project: " + p.getProjectId());
      System.out.println("project members size: " + p.members.size());
      System.out.println("project max size: " + p.getMaxSize());
      System.out.println("does p contain s: " + p.members.contains(s));
      if (displacedProj != null)
        System.out.println("displaced project: " + displacedProj.getProjectId());
      System.out.println("student " + s.getUserId());
      if (p != null && p.members.size() < p.getMaxSize() && !p.members.contains(s) && p != displacedProj && p.members.size() >= p.getMinSize()) { // found a
                                                                                                            // spot for
                                                                                                            // them
        System.out.println("ADDING " + s.getLastName() + " to project " + p.getProjectId());
        boolean add = (displacedProj == null) || (displacedProj.members.size() > displacedProj.getMinSize());
        if (add) p.members.add(s);
        if (displacedProj != null) {
          displacedProj.members.remove(s);
        }
        return true;
      }
    }
    // if we need to bump someone out
    for (int i = 0; i < s.orderedRankings.size(); i++) {
      System.out.println("there is NOT space for their top 5?");
      Project p = GetProjectWithName(s.orderedRankings.get(i));
      System.out.println("project: " + p.getProjectId());
      System.out.println("project members size: " + p.members.size());
      System.out.println("project max size: " + p.getMaxSize());
      System.out.println("does p contain s: " + p.members.contains(s));
      if (displacedProj != null)
        System.out.println("displaced project: " + displacedProj.getProjectId());
      System.out.println("student " + s.getUserId());
      //roject p = GetProjectWithName(s.orderedRankings.get(i));
      if (p != null && p.members.size() == p.getMaxSize() && !p.members.contains(s) && p != displacedProj && p.members.size() >= p.getMinSize())  {
        Random rand = new Random();
        int index = rand.nextInt(p.members.size());
        Student displaced = (p.members).get(index);
        if (p.members.size() > p.getMinSize() && !p.members.contains(s) && BumpHelper(displaced, level + 1, p, index)) {
          System.out.println("BUMP HELPER IF STATEMENT");
          System.out.println("ADDED " + s.getLastName() + " to project " + p.getProjectId());
          boolean add = (displacedProj == null) || (displacedProj.members.size() > displacedProj.getMinSize());
          if (add) p.members.add(s);
          if (displacedProj != null) {
            displacedProj.members.remove(s);
          }
          return true;
        }
      }
    }
    // Random rand = new Random();
    // int randProjIndex = rand.nextInt(projects.size());
    // Project randProject = projects.get(randProjIndex);
    // //int displacedStudentIndex = rand.nextInt(randProject.members.size());
    // //Student displaced = randProject.members.get(displacedStudentIndex);
    // System.out.println("RANDOM project");
    // // Project p = GetProjectWithName(s.orderedRankings.get(i));
    // System.out.println("project: " + randProject.getProjectId());
    // System.out.println("project members size: " + randProject.members.size());
    // System.out.println("project max size: " + randProject.getMaxSize());
    // System.out.println("does p contain s: " + randProject.members.contains(s));
    // if (displacedProj != null)
    //   System.out.println("displaced project: " + displacedProj.getProjectId());
    // System.out.println("student " + s.getUserId());
    // if (randProject != null && randProject.members.size() < randProject.getMaxSize() && !randProject.members.contains(s)
    //     && randProject != displacedProj && randProject.members.size() >= randProject.getMinSize()) { // found a spot for them
    //   System.out.println("ADDING " + s.getLastName() + " to project " + randProject.getProjectId());
    //   boolean add = (displacedProj == null) || (displacedProj.members.size() > displacedProj.getMinSize());
    //   if (add) randProject.members.add(s);
    //   if (displacedProj != null) {
    //     displacedProj.members.remove(s);
    //   }
    //   return true;
    // } else if (randProject != null && randProject.members.size() == randProject.getMaxSize()
    //     && !randProject.members.contains(s) && randProject != displacedProj && randProject.members.size() >= randProject.getMinSize()) { // found a spot for them
    //   //Random rand = new Random();
    //   int index = rand.nextInt(randProject.members.size());
    //   Student displaced = (randProject.members).get(index);
    //   if (randProject.members.size() > randProject.getMinSize() && !randProject.members.contains(s)
    //       && BumpHelper(displaced, level + 1, randProject, index)) {
    //     System.out.println("BUMP HELPER IF STATEMENT");
    //     System.out.println("ADDED " + s.getLastName() + " to project " + randProject.getProjectId());
    //     boolean add = (displacedProj == null) || (displacedProj.members.size() > displacedProj.getMinSize());
    //     if (add) randProject.members.add(s);
    //     if (displacedProj != null) {
    //       displacedProj.members.remove(s);
    //     }
    //     return true;
    //   }
    // }
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
      Collections.sort(unassignedProjects, new Project.openSpotsToMinSizeComparator());
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
            System.out.println("ADDING " + s.getUserId() + " TO PROJECT " +p.getProjectId());
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
        while (index < lastAssignedProjectMembers.size()-1) {
          index++;
          if (p.getMembers().size() < p.getMaxSize()) {
            System.out.println("LAST ASSXIGNED PROJECT ADDING " + lastAssignedProjectMembers.get(index).getUserId() + " TO PROJECT " +p.getProjectId());
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