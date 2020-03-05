package capstone.controller;



import java.util.ArrayList;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import capstone.model.Global;
import capstone.model.Project;
import capstone.model.Ranking;
import capstone.model.users.Stakeholder;
import capstone.model.users.Student;
import capstone.model.users.User;
import capstone.repository.GlobalRepository;
import capstone.service.ProjectService;
import capstone.service.UserService;
import capstone.service.EmailService;
import capstone.util.Constants;
import capstone.util.EncryptPassword;

@RestController
@RequestMapping("/projects")
public class ProjectController 
{
	@Autowired
	private ProjectService projectService;
	@Autowired
	private UserService userService;
	@Autowired
	private GlobalRepository globalRepo;
  @Autowired
  private EmailService emailService;
	
	public ProjectController()
	{
	}
	
	// Initialize database tables with sample students and projects taken from the Spring 2018 class.
	@GetMapping("/init")
	@CrossOrigin
	public String initTables() {
		projectService.initTables();
		return Constants.SUCCESS;
	}
	
	/* Getting projects from user information */
	
	@GetMapping("")
	@CrossOrigin
	public List<Project> getProjects()
	{
		Global g = globalRepo.findAll().get(0);
		int targetSemester = g.getSemester();
		int targetFallSpring = g.getFallSpring();
		List<Project> projects = (List<Project>) projectService.findAll();
		List<Project> validProjects = new ArrayList<Project>();
		for (Project project : projects)
		{
			if (project.getSemester() == targetSemester && project.getFallSpring() == targetFallSpring)
			{
				validProjects.add(project);
			}
			
		}
		return validProjects;
		//return projectService.findAll();
	}
	@GetMapping("getprojectsfromsemester/{semester}/{fallspring}")
	@CrossOrigin
	public @ResponseBody List<Project> getProjectsFromSemester(@PathVariable("semester") int semester, @PathVariable("fallspring") int fallspring)
	{
		System.out.println("in the get projects from semester");
		System.out.println("semester: " + semester + " value: " + fallspring);
		// Global g = globalRepo.findAll().get(0);
		int targetSemester = semester;
		int targetFallSpring = fallspring;
		List<Project> projects = (List<Project>) projectService.findAll();
		System.out.println("projects size: " + projects.size());
		List<Project> validProjects = new ArrayList<Project>();
		for (Project project : projects)
		{
			System.out.println("target s: " + semester + " target sf: " + fallspring);
			System.out.println("semester: " + project.getSemester() + " fallspring: " + project.getFallSpring());
			if (project.getSemester() == targetSemester && project.getFallSpring() == targetFallSpring)
			{
				validProjects.add(project);
			}
			System.out.println("valid size: " + validProjects.size());
		}
		return validProjects;
	}
	
	@GetMapping("/{email:.+}/rankings")
	@CrossOrigin
	public List<Ranking> getRankOrderedProjects(@PathVariable("email") String email)
	{
		//Global g = globalRepo.findAll().get(0);
		Student student = (Student) userService.findUserByEmail(email);
		int targetSemester = student.semester;
		int targetFallSpring = student.fallSpring;
	
		List<Project> projects = projectService.findAll();
		List<Ranking> rankings = projectService.rankRepo.findAll();
		List<Ranking> studentRankings = new ArrayList<Ranking>(5);
		
		if(!rankings.isEmpty())
		{
			boolean hasStudent = false;
			
			for(Ranking ranking : rankings)
			{
				long studentID = ranking.getStudentId();
				long userID = userService.findUserByEmail(email).getUserId();
				if(studentID == userID)
				{
					studentRankings.add(ranking);
				}
			}
			
    }
		
		return studentRankings;
	}
	
	// Get all projects that a stakeholder owns
	@GetMapping("/{email:.+}")
	@CrossOrigin
	public List<Project> getProjectsByEmail(@PathVariable("email") String email) {
		System.out.println("stakeholder email : " + email);
		
		Stakeholder user = userService.findStakeholderByEmail(email);
		List<Project> projects = userService.getStakeholderProjects(user);
		
		for(Project pro : projects) {
			System.out.println("project name: " + pro.getProjectName());
		}
		
		return projects;
	}
	
	// Get one project that a stakeholder owns
	@GetMapping("/{email:.+}/{projectId}")
	@CrossOrigin
	public Project getProjectByEmailAndId(@PathVariable("email") String email,
			@PathVariable("projectId") Long projectId) {
		Stakeholder user = userService.findStakeholderByEmail(email);
		List<Project> projects = userService.getStakeholderProjects(user);
		for (Project project : projects) {
			if (project.getProjectId() == projectId) {
				return project;
			}
		}
		return null;
	}

  @GetMapping("/id/{projectId}")
  @CrossOrigin
  public Project getProjectById(@PathVariable("projectId") int projectId) {
    Project project = projectService.findByProjectId(projectId);
    return project;
  }
	// Get a student's project
	@GetMapping("/student/{email:.+}")
	@CrossOrigin
	public @ResponseBody Project getUserProject(@PathVariable("email") String email) {
		try
		{
			Student user = (Student) userService.findUserByEmail(email);
			System.out.println(user.getProject().getProjectName());
			return user.getProject();
		}
		catch(NullPointerException e)
		{
			System.out.println("NULL");
			return null;
		}
	}
	
	/* Getting users from project information */
	
	@GetMapping("/{projectId}/students")
	@CrossOrigin
	public @ResponseBody List<User> getAllStudentsOnProject(@PathVariable("projectId") int projectId) {
		return userService.findAllByProject(projectService.findByProjectId(projectId));
	}
	
	@GetMapping("/{projectId}/stakeholder")
	@CrossOrigin
	public @ResponseBody User getStakeholderOnProject(@PathVariable("projectId") int projectId) {
		List<Stakeholder> stakeholders = (List<Stakeholder>) userService.getStakeholders();
		for (Stakeholder s : stakeholders) {
			for (Project p : s.getProjectIds()) {
				if (p.getProjectId() == projectId) {
					return s;
				}
			}
		}
		return null;
	}
	
	/* Project Matching */

	@GetMapping("/assignment")
	@CrossOrigin
	public List<Project> projectAssignment()
	{
		System.out.println("running assignment");
		/*// WIP: Return an existing matching if students have already been assigned to projects
		 * List<Project> existing = projectService.getExistingAssignments();
		if (existing != null && existing.size() > 0) {
			return existing;
		}*/
		return projectService.runAlgorithm();
	}
	
	@GetMapping("/assignment-retrieve")
	@CrossOrigin
	public List<Project> retrieveProjectAssignment()
	{
		return projectService.getExistingAssignments();
	}
	
	@GetMapping("/assignment/exists")
	public String assignmentExists() {
		List<Project> existing = projectService.getExistingAssignments();
		if (existing != null && existing.size() > 0) {
			return "true";
		}
		return "false";
	}
	
	// Assign projects to students
	@PostMapping("/assign-to-students")
	@CrossOrigin
	public @ResponseBody String assignProjectsToStudents(@RequestBody ArrayList<Project> projects) {
		for (Project project : projects) {
			if (project.getProjectId() > 0) {
				for (Student student : project.getMembers()) {
					// Set the given project for each student
					Student saveStudent = userService.findByUserId(student.getUserId());
					saveStudent.setProject(project);
					userService.saveUser(saveStudent);
				}
			}
		}
		projectService.saveAssignment(projects);
		return Constants.SUCCESS;
	}
	
	// Submit project ranking for a student
	//@PostMapping("/rankingsSubmitAttempt/{email:.+}")
	@PostMapping("/{email:.+}/submit-ranking")
	@CrossOrigin
	public @ResponseBody String projectRankingsSubmission(@PathVariable("email") String email, @RequestBody List<Ranking> projects) {
    User user = userService.findUserByEmail(email);
		List<Ranking> rankings = projectService.rankRepo.findAll();
		for (Ranking rank : rankings) {
			Student student = null;
      if (user.getUserId() == rank.getStudentId()) {
        projectService.rankRepo.delete(rank.getRankingId());
      }
		}
    for(Ranking newRank: projects) {
      newRank.setStudentId(user.getUserId());
      newRank.setRank(projects.indexOf(newRank));
      try {
        projectService.saveRanking(newRank);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

		return Constants.SUCCESS;
	}
	
	/* Project submission and status */
	
	// When a stakeholder submits a proposal
	// Save a new project and attach a stakeholder to that project
	@PostMapping("/save/{email:.+}")
	@CrossOrigin
	public @ResponseBody String saveData(@PathVariable("email") String email, 
			@RequestBody Project project)
	{
		System.out.println("Received HTTP POST");
		System.out.println(project);
		System.out.println(project.getProjectName());
    System.out.println("Company: " + project.getStakeholderCompany());
		project.setStatusId(1);
//		project.setSemester(globalRepo.findAll().get(0).getSemester());
//		project.setFallSpring(globalRepo.findAll().get(0).getFallSpring());
		User user = userService.findUserByEmail(email);
	    projectService.save(project);
	    userService.saveProject(user, project);
		System.out.println("Project has been saved");
		return Constants.SUCCESS;
	}
	
	@PostMapping("/pending/{projectId}")
	@CrossOrigin
	public @ResponseBody String pendingProjects(@PathVariable("projectId") int projectId) {
		Project project = projectService.findByProjectId(projectId);
		project.setStatusId(1);
		project.setAdminComments("");
		projectService.save(project);
		return Constants.SUCCESS;
	}
	
	@PostMapping("/approve/{projectId}")
	@CrossOrigin
	public @ResponseBody String approveProjects(@PathVariable("projectId") int projectId) {
		Project project = projectService.findByProjectId(projectId);
		project.setStatusId(2);
		project.setAdminComments("");
		projectService.save(project);
    Stakeholder stakeholder = new Stakeholder();
     List<Stakeholder> stakeholders = (List<Stakeholder>) userService.getStakeholders();
      for (Stakeholder s : stakeholders) {
        for (Project p : s.getProjectIds()) {
          if (p.getProjectId() == projectId) {
            stakeholder = s;
          }
        }
      }
    String email = stakeholder.getEmail();
    emailService.sendEmail("Project Proposal Approved", "Your project proposal has been approved!", email);
		return Constants.SUCCESS;
	}
	
	@PostMapping("/reject/{projectId}")
	@CrossOrigin
	public @ResponseBody String rejectProjects(@PathVariable("projectId") int projectId) {
		Project project = projectService.findByProjectId(projectId);
		project.setAdminComments("");
		project.setStatusId(3);
		projectService.save(project);
    Stakeholder stakeholder = new Stakeholder();
     List<Stakeholder> stakeholders = (List<Stakeholder>) userService.getStakeholders();
      for (Stakeholder s : stakeholders) {
        for (Project p : s.getProjectIds()) {
          if (p.getProjectId() == projectId) {
            stakeholder = s;
          }
        }
      }
    String email = stakeholder.getEmail();
    emailService.sendEmail("Project Proposal Rejected", "Your project proposal has been rejected. Please feel free to reach out regarding any questions.", email);
		return Constants.SUCCESS;
	}
	
//	@PostMapping("/update-info")
//	@CrossOrigin
//	public @ResponseBody String updateProjectInfo(@RequestBody Map<String, String> info) {
//		System.out.println("in the update project info");
		
//		String projectId = info.get("projectId");
//		Project project = projectService.findByProjectId(Integer.parseInt(projectId));
//		
//		
//		String name = info.get("projectName");
//		int number = Integer.parseInt(info.get("projectNum"));
//		String technology = info.get("technology");
//		String background = info.get("background");
//		String descrip = info.get("description");
//		
//		System.out.print("id: " + projectId);
//		System.out.print("new name: " + name);
//		System.out.println("new t: " + technology);
//		
//		
//		project.setMinSize(number);
//		project.setTechnologies(technology);
//		project.setBackground(background);
//		project.setDescription(descrip);
//		project.setProjectName(name);
//		
//		System.out.println("after chage");
//		projectService.save(project);
//		return "in the update project";
//	}
	
	@RequestMapping(value = "/dabao", method = RequestMethod.POST)
	@CrossOrigin
	public void update(@RequestBody Map<String, String> info) {
		System.out.println("info in test: " + info.size());
		System.out.println("name: " + info.get("projectName"));
		
		String projectId = info.get("projectId");
		Project project = projectService.findByProjectId(Integer.parseInt(projectId));
		
		
		String name = info.get("projectName");
		int min = Integer.parseInt(info.get("projectMin"));
		int max = Integer.parseInt(info.get("projectMax"));
		String technology = info.get("technology");
		String background = info.get("background");
		String descrip = info.get("description");
		int status = Integer.parseInt(info.get("statusId"));
		
		//System.out.print("id: " + projectId);
		System.out.print("status: " + status);
//		System.out.print("new name: " + name);
//		System.out.println("new t: " + technology);
//		System.out.println("descrip: " + descrip);
		
		project.setMinSize(min);
		project.setMaxSize(max);
		project.setTechnologies(technology);
		project.setBackground(background);
		project.setDescription(descrip);
		project.setProjectName(name);
		project.setStatusId(status);
		
		System.out.println("after chage");
		projectService.save(project);
		return;
	}
	
	
	
	@PostMapping("/change/{projectId}")
	@CrossOrigin
	public @ResponseBody String requestChangeProjects(@PathVariable("projectId") int projectId) {
		Project project = projectService.findByProjectId(projectId);
		project.setStatusId(4);
		projectService.save(project);
		return Constants.SUCCESS;
	}
	
	@PostMapping("/change/adminComments/{projectId}")
	@CrossOrigin
	public @ResponseBody String requestChangeAdminCommentProjects(@PathVariable("projectId") int projectId,
																  @RequestBody String adminComments) {
		Project project = projectService.findByProjectId(projectId);
		project.setStatusId(4);
		project.setAdminComments(adminComments);
		projectService.save(project);
    Stakeholder stakeholder = new Stakeholder();
     List<Stakeholder> stakeholders = (List<Stakeholder>) userService.getStakeholders();
      for (Stakeholder s : stakeholders) {
        for (Project p : s.getProjectIds()) {
          if (p.getProjectId() == projectId) {
            stakeholder = s;
          }
        }
      }
    String email = stakeholder.getEmail();
    emailService.sendEmail("Requested Changes On Project Proposal","There has been changes requested on your project proposal: <strong>" + adminComments +"</strong>", email);
		return Constants.SUCCESS;
	}
	
	
}

	

