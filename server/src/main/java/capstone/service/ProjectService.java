package capstone.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import capstone.model.Global;
import capstone.model.Project;
import capstone.model.Ranking;
import capstone.model.users.Student;
import capstone.repository.AdminConfigurationRepository;
import capstone.repository.GlobalRepository;
import capstone.repository.ProjectsRepository;
import capstone.repository.RankingRepository;
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
	
	private ProjectAssignment maxAlgorithm;
	private static String folder_name = "src/main/java/capstone/algorithm/real_data";
	private static int NUM_RANKED = 5; // number of projects that each student can rank
	public static Map<Double, ProjectAssignment> algorithms = new HashMap<>();
	public static Map<Double, Integer> iterations = new HashMap<>();
	private List<Project> savedProjects = new ArrayList<Project>();
	Vector<Project> projectsVector = new Vector<>();
	Vector<Student> studentsVector = new Vector<>();
	List<Ranking> rankings = new ArrayList<Ranking>();
	public List<Project> runAlgorithm() {
		System.out.println("RUNNING ALGORITHM");
		for (int iteration = 0; iteration < 2; iteration++) {
			System.out.println("iteration " + iteration + "!");
			//Global g = globalRepo.findAll().get(0);
			
			int targetSemester = 2020;
			System.out.println("target semester: " + targetSemester);
			
			int targetFallSpring = 0;
			System.out.println("targetFallSpring: " + targetFallSpring);
			ArrayList<Project> projects = new ArrayList<>(projectsVector);
			ArrayList<Student> students = new ArrayList<>(studentsVector);
//			for (Project p : findAll()) {
//				if (p.getSemester() == targetSemester && p.getFallSpring() == targetFallSpring)
//				{
//					projects.add(new Project(p));
//				}
//			}
//			for (Student s : userService.getStudents()) {
//				if (s.semester == targetSemester && s.fallSpring == targetFallSpring)
//				{
//					students.add(new Student(s));
//				}
//			}
			
			
			for (Ranking rank : rankings) {
				//System.out.print("ranking! ");
			
				Student student = null;
				for (Student s : students) {
					if (s.getUserId() == rank.getStudentId()) {
						student = s;
						
					}
				
				
					Project project = null;
					for (Project p : projects) {
						if (p.getProjectId() == rank.getProjectId()) {
							project = p;
							if (project != null && student != null) {
								//String projectName = project.getProjectName();
							//System.out.println("student: " + student.getLastName() + "projectName:" + projectName);
					            //student.rankings.put(projectName, rank.getRank());
					            //student.orderedRankings.add(projectName);
								
								Integer ip = ProjectAssignment.getStudentSatScore(rank.getRank());
					            project.incSum_p(ip);
					            project.incN();
							}
						}
					}
					
				}
				
					
			}
			
			ProjectAssignment algorithm = new ProjectAssignment(projects, students);
			algorithm.run(iteration, NUM_RANKED, folder_name);
			double groupSatScore = algorithm.algoSatScore;
			algorithms.put(groupSatScore, algorithm);
			iterations.put(groupSatScore, iteration);
		}

		Double maxScore = Collections.max(algorithms.keySet());
		
		maxAlgorithm = algorithms.get(maxScore);
		Integer maxIteration = iterations.get(maxScore);
		System.out.println("maxScore: " + maxScore + ". maxIteration: " + maxIteration);
		
		//System.out.println(maxAlgorithm.JSONOutputWeb());
		savedProjects = maxAlgorithm.assignedProjects();
		return savedProjects;
	}
	
	public void initTables() {
		System.out.println("INIT TABLES");
		String line = null;
        try {
            BufferedReader projectsBR = new BufferedReader(new FileReader(folder_name + "/projects.txt"));
            
            while((line = projectsBR.readLine()) != null) {                
                String[] elements = line.split(" ");
                
                
                Project newProject = new Project(ProjectAssignment.getStudentSatScore(1));
                newProject.setProjectName(elements[0]);
                
                //System.out.println("projectIdString" + Integer.parseInt(elements[0].substring(11)));
                newProject.setProjectId(Integer.parseInt(elements[0].substring(11))); // TODO: MAKE THIS DYNAMIC WITH AUTOINCREMENT
                newProject.setMinSize(Integer.parseInt(elements[1]));
                newProject.setMaxSize(Integer.parseInt(elements[2]));
                projectsVector.addElement(newProject);
                
                System.out.println("Saving project: " + newProject.getProjectName());
                //save(newProject);
                
                //writer.println(newProject);
            }
            
            projectsBR.close();         
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        //writer.println("");
        
        // import users and rankings from text file
        try {
            BufferedReader studentsBR = new BufferedReader(new FileReader(folder_name + "/rankings.txt"));

            while((line = studentsBR.readLine()) != null) {                
                String[] elements = line.split(" ");
                
                Student newStudent = new Student();
                newStudent.setFirstName("Student");
                String last = elements[0].substring(7);
                newStudent.setLastName(last);
                newStudent.setEmail(elements[0] + "@usc.edu");
                newStudent.setPassword(EncryptPassword.encryptPassword("student"));
                newStudent.setUserId(Long.parseLong(last));
                //newStudent.setUserId(students.size());
                
                for (int i = 1; i <= NUM_RANKED; i++) { // for the student's Top 5 projects...
            			int projectId = Integer.parseInt(elements[i]);
            			Project rankedProject = projectsVector.elementAt(projectId - 1); // !!! SUBTRACT 1, as the ranking's indices skip 0 for readability
                		
                		// add rankedProject to the Student data structure:
                    String projectName = rankedProject.getProjectName();
                    newStudent.rankings.put(projectName, i);
                    newStudent.orderedRankings.add(projectName);
                    
                    // popularity metrics:
                    //Integer p = ProjectAssignment.getStudentSatScore(i);
                    //rankedProject.incSum_p(p);
                    //rankedProject.incN();
                }
                //userService.saveUser(newStudent);
                System.out.println("Saving student " + newStudent.getLastName());
                studentsVector.addElement(newStudent);
                //writer.println(newStudent);
            }
            
            //writer.println("");
            studentsBR.close();         
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        
        for(Student s: studentsVector) {
        	System.out.println("student name: " + s.getLastName());
			for (Map.Entry<String, Integer> entry : s.rankings.entrySet()) {
				Project p  = GetProjectWithName(projectsVector, entry.getKey());
				int projectId = p.getProjectId();
				System.out.println("projectId: " + projectId + ", Ranking: " + entry.getValue());
				Long studentId = s.getUserId();
				System.out.println("studentId: " + studentId);
				
				rankings.add(new Ranking(studentId, projectId, entry.getValue()));
				s.orderedRankings.add(p.getProjectName());
			}
		}
	}
	
	Project GetProjectWithName(Vector<Project> projects, String projname) {
		for (int j=0; j<projects.size(); j++) {
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

	public void saveRanking(int projectId, Long userId, int ranking) {
		rankRepo.save(new Ranking(userId, projectId, ranking));
	}

	public Project findByProjectId(int projectId) {
		return repository.findByProjectId(projectId);
	}
	
	public void saveAssignment(ArrayList<Project> projects) {
		/*AdminConfiguration ac = configRepo.findById(Long.valueOf(1));
		if (ac == null) {
			ac = new AdminConfiguration();
		}
		ArrayList<Project> finalProjects = (ArrayList<Project>) ac.getAssignment();
		for (Project p : projects) {
			Project saveProj = findByProjectId(p.getProjectId());
			List<Student> saveMembers = saveProj.getMembers();
			for (Student s : p.getMembers()) {
				saveMembers.add(userService.findByUserId(s.getUserId()));
			}
			saveProj.setMembers(saveMembers);
			finalProjects.add(saveProj);
		}
		ac.setAssignment(finalProjects);
		configRepo.save(ac);*/
		savedProjects = projects;
	}

	public List<Project> getExistingAssignments() {
		
		Global g = globalRepo.findAll().get(0);
		int fall_spring = g.getFallSpring();
		int semester = g.getSemester();
		
		List<Project> allProjects = findAll();
		List<Project> currentProjects = new ArrayList<Project>();
		for(Project p: allProjects) {
			if(p.getSemester() == semester && p.getFallSpring() == fall_spring) {
				currentProjects.add(new Project(p));
			}
		}
		
		Collection<Student> allStudents = userService.getStudents();
		for(Iterator<Student> it = allStudents.iterator(); it.hasNext();) {
			Student s = it.next();
			for(Iterator<Project> itP = currentProjects.iterator(); itP.hasNext();) {
				Project p = itP.next();
				//p.members = new ArrayList<Student>();
				if(p.getProjectId() == s.getProject().getProjectId()) {
					System.out.println(s.getFirstName() + s.getProject().getProjectId());
					(p.members).add(s);
				}
			}
		}
		return currentProjects;
	}
}
