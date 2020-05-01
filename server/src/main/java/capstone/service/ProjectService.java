package capstone.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import capstone.model.Global;
import capstone.model.Project;
import capstone.model.Ranking;
import capstone.model.users.Student;
import capstone.model.AdminConfiguration;
import capstone.repository.AdminConfigurationRepository;
import capstone.repository.GlobalRepository;
import capstone.repository.ProjectsRepository;
import capstone.repository.RankingRepository;
import capstone.repository.StudentRepository;
import capstone.util.EncryptPassword;
import capstone.util.ProjectAssignment;

@Scope("prototype")
@Service
public class ProjectService {
  @Autowired
  ProjectsRepository repository;
  @Autowired
  UserService userService;
  @Autowired
  public RankingRepository rankRepo;
  @Autowired
  AdminConfigurationRepository configRepo;
  @Autowired
  GlobalRepository globalRepo;
  @Autowired
  StudentRepository studentRepo;
  private ProjectAssignment maxAlgorithm;
  private static String folder_name = "src/main/java/capstone/algorithm/real_data";
  private static int NUM_RANKED = 5; // number of projects that each student can rank
  public static Map<Double, ProjectAssignment> algorithms = new HashMap<>();
  public static Map<Double, Integer> iterations = new HashMap<>();
  private List<Project> savedProjects = new ArrayList<Project>();
  Vector<Project> projectsVector = new Vector<>();
  Vector<Student> studentsVector = new Vector<>();
  List<Ranking> rankings = new ArrayList<Ranking>();
  Map<Student, Integer> maxAlgorithmStudentsToProjects = new HashMap<Student, Integer>();

  public List<Project> runAlgorithm() {
    try {
      int targetSemester = 2020;
      int targetFallSpring = 0;
      ArrayList<Student> students = studentRepo.findBySemesterAndFallSpring(targetSemester, targetFallSpring);
      ArrayList<Project> projects = repository.findBySemesterAndFallSpring(targetSemester, targetFallSpring);
      rankings = rankRepo.findAll();
      Double maxScore = 0.0;
      Integer maxIteration = -1;
      for (int iteration = 0; iteration < 30; iteration++) {
        System.out.println("iteration " + iteration + "!");
        for (Ranking rank : rankings) {
          Student student = null;
          for (Student s : studentRepo.findAll()) {
            if (s.getUserId() == rank.getStudentId()) {
              student = s;
            }
          }
          Project project = null;
          project = repository.findByProjectId(rank.getProjectId());
          if (project != null && student != null) {
            String projectName = project.getProjectName();
            Integer ip = ProjectAssignment.getStudentSatScore(rank.getRank());
            project.incSum_p(ip);
            project.incN();
          }
        }
        ProjectAssignment algorithm = new ProjectAssignment(projects, students, rankings);
        algorithm.run(iteration, NUM_RANKED, folder_name);
        double groupSatScore = algorithm.algoSatScore;
        if (groupSatScore > maxScore) {
          maxScore = groupSatScore;
          maxIteration = iteration;
          savedProjects.clear();
          for (Project p : algorithm.assignedProjects()) {
            for (Student s : p.getMembers()) {
              maxAlgorithmStudentsToProjects.put(s, p.getProjectId());
            }
            savedProjects.add(p);
          }
            
        }
      }
      System.out.println("maxScore: " + maxScore + ". maxIteration: " + maxIteration);
    } catch (Exception e) {
      System.out.println("HERE HEY hEy heA im here");
      e.printStackTrace();
    }
    for (Project p : savedProjects) {
      p.getMembers().clear();
    }
    for (Student s : maxAlgorithmStudentsToProjects.keySet()) {
      Integer projectId = maxAlgorithmStudentsToProjects.get(s);
      for (Project p : savedProjects) {
        if (p.getProjectId() == projectId) {
          p.getMembers().add(s);
        }
      }
    }
    Collections.sort(savedProjects, new Project.alphabeticalComparator());
    return savedProjects;
  }

  public void initTables() {
    String line = null;
    try {
      BufferedReader projectsBR = new BufferedReader(new FileReader(folder_name + "/projects.txt"));

      while ((line = projectsBR.readLine()) != null) {
        String[] elements = line.split(" ");

        Project newProject = new Project(ProjectAssignment.getStudentSatScore(1));
        newProject.setProjectName(elements[0]);
        newProject.setProjectId(Integer.parseInt(elements[0].substring(11))); // TODO: MAKE THIS DYNAMIC WITH
                                                                              // AUTOINCREMENT
        newProject.setMinSize(Integer.parseInt(elements[1]));
        newProject.setMaxSize(Integer.parseInt(elements[2]));
        newProject.setStatusId(2);
        newProject.setSemester(2020);
        projectsVector.addElement(newProject);
        save(newProject);
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
        newStudent.setFirstName("Student");
        String last = elements[0].substring(7);
        newStudent.setLastName(last);
        newStudent.setEmail(elements[0] + "@usc.edu");
        newStudent.setPassword(EncryptPassword.encryptPassword("student"));
        newStudent.setUserId(Long.parseLong(last)+1);
        // newStudent.setUserId(students.size());

        for (int i = 1; i <= NUM_RANKED; i++) { // for the student's Top 5 projects...
          // System.out.println("elements[i] " + elements[i]);
          int projectId = Integer.parseInt(elements[i]);
          Project rankedProject = projectsVector.elementAt(projectId - 1); // !!! SUBTRACT 1, as the ranking's indices
                                                                           // skip 0 for readability

          // add rankedProject to the Student data structure:
          String projectName = rankedProject.getProjectName();
          newStudent.rankings.put(projectName, i);
          newStudent.orderedRankings.add(projectId);
          newStudent.semester = 2020;

          // popularity metrics:
          // Integer p = ProjectAssignment.getStudentSatScore(i);
          // rankedProject.incSum_p(p);
          // rankedProject.incN();
        }
        userService.saveUser(newStudent);
        studentsVector.addElement(newStudent);
        // writer.println(newStudent);
      }

      // writer.println("");
      studentsBR.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
    for (Student s : studentsVector) {
      for (Map.Entry<String, Integer> entry : s.rankings.entrySet()) {
        Project p = GetProjectWithName(projectsVector, entry.getKey());
        int projectId = p.getProjectId();
        Long studentId = s.getUserId();

        rankRepo.save(new Ranking(studentId, projectId, entry.getValue()));
        s.orderedRankings.add(projectId);
      }
    }
  }

  Project GetProjectWithName(Vector<Project> projects, String projname) {
    for (int j = 0; j < projects.size(); j++) {
      if (projects.get(j).getProjectName().equals(projname))
        return projects.get(j);
    }
    return null;
  }

  public void save(Project project) {
    repository.save(project);
  }

  public List<Project> findAll() {
    return (List<Project>) repository.findAll();
  }

  public void saveRanking(Ranking ranking) {
    rankRepo.save(ranking);
  }

  public Project findByProjectId(int projectId) {
    return repository.findByProjectId(projectId);
  }

  public void saveAssignment(ArrayList<Project> projects, int semester, int fallSpring) {

    AdminConfiguration ac = configRepo.findBySemesterAndFallSpring(semester, fallSpring);
    if (ac == null) {
      ac = new AdminConfiguration();
      ac.setSemester(semester);
      ac.setFallSpring(fallSpring);
    }
    ArrayList<Project> finalProjects = new ArrayList<Project>();
    for (Project p : projects) {
      Project saveProj = findByProjectId(p.getProjectId());
      saveProj.setMembers(new ArrayList<Student>());
    }
    for (Project p : projects) {
      Project saveProj = findByProjectId(p.getProjectId());
      ArrayList<Student> saveMembers = new ArrayList<Student>();
      for (Student s : p.getMembers()) {
        saveMembers.add(userService.findByUserId(s.getUserId()));
      }
      saveProj.setMembers(saveMembers);
      finalProjects.add(saveProj);
    }
    ac.setAssignment(finalProjects);
    configRepo.save(ac);
  }

  public List<Project> getExistingAssignments(int semester, int fallSpring) {
    AdminConfiguration ac = configRepo.findBySemesterAndFallSpring(semester, fallSpring);
    if (ac == null) {
      return new ArrayList<Project>();
    }
    List<Project> currentProjects = ac.getAssignment();
    return currentProjects;
  }

  public Project getProjectById(int id) {
    return repository.findByProjectId(id);
  }
}
