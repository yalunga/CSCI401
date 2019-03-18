package capstone.controller;



import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
import capstone.util.Constants;

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
	
	@GetMapping("/{email:.+}/rankOrdered")
	@CrossOrigin
	public List<Project> getRankOrderedProjects(@PathVariable("email") String email)
	{
		//Global g = globalRepo.findAll().get(0);
		Student student = (Student) userService.findUserByEmail(email);
		int targetSemester = student.semester;
		int targetFallSpring = student.fallSpring;
	
		List<Project> projects = projectService.findAll();
		List<Ranking> rankings = projectService.rankRepo.findAll();
		List<Project> orderedProjects = new ArrayList<Project>(5);
		
		if(!rankings.isEmpty())
		{
			boolean hasStudent = false;
			
			for(Ranking ranking : rankings)
			{
				long studentID = ranking.getStudentId();
				long userID = userService.findUserByEmail(email).getUserId();
				if(studentID == userID)
				{
					hasStudent = true;
					break;
				}
			}
			
			if(hasStudent)
			{
				if(projects.size() >= 5)
				{
					orderedProjects.add(null);
					orderedProjects.add(null);
					orderedProjects.add(null);
					orderedProjects.add(null);
					orderedProjects.add(null);
				}
				else
				{
					for(int i = 0; i < projects.size(); i++)
					{
						orderedProjects.add(null);
					}
				}
			}
		}

		for(Ranking ranking : rankings)
		{
			long studentID = ranking.getStudentId();
			long userID = userService.findUserByEmail(email).getUserId();
			if(studentID == userID)
			{
				int index = ranking.getRank() - 1;
				orderedProjects.set(index, projectService.findByProjectId(ranking.getProjectId()));
			}
		}
		
		for(Project project : projects)
		{
			boolean isInList = orderedProjects.contains(project);
			if(!isInList)
			{
				if(project.getSemester() == targetSemester && project.getFallSpring() == targetFallSpring)
				{
					orderedProjects.add(project);
				}
			}
		}
		
		return orderedProjects;
	}
	
	// Get all projects that a stakeholder owns
	@GetMapping("/{email:.+}")
	@CrossOrigin
	public List<Project> getProjectsByEmail(@PathVariable("email") String email) {
		Stakeholder user = userService.findStakeholderByEmail(email);
		List<Project> projects = userService.getStakeholderProjects(user);
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
	public @ResponseBody String projectRankingsSubmission(@PathVariable("email") String email, @RequestBody List<Integer> projects) {
		User user = userService.findUserByEmail(email);
		List<Ranking> rankings = projectService.rankRepo.findAll();
		for (Ranking rank : rankings) {
			Student student = null;
				if (user.getUserId() == rank.getStudentId()) {
					projectService.rankRepo.delete(rank.getRankingId());
				}
			}
		for (int rank = 1; rank <= 5; rank++) {
			projectService.saveRanking(projects.get(rank-1), user.getUserId(), rank);
		}
		return Constants.SUCCESS;
	}
	
	/* Project submission and status */
	
	// When a stakeholder submits a proposal
	// Save a new project and attach a stakeholder to that project
	@PostMapping("/save/{email:.+}")
	@CrossOrigin
	public @ResponseBody Project saveData(@PathVariable("email") String email, 
			@RequestBody Project project)
	{
		System.out.println("Received HTTP POST");
		System.out.println(project);
		System.out.println(project.getProjectName());
		project.setStatusId(1);
		project.setSemester(globalRepo.findAll().get(0).getSemester());
		project.setFallSpring(globalRepo.findAll().get(0).getFallSpring());
		User user = userService.findUserByEmail(email);
	    projectService.save(project);
	    userService.saveProject(user, project);
		return project;
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
		return Constants.SUCCESS;
	}
	
	@PostMapping("/reject/{projectId}")
	@CrossOrigin
	public @ResponseBody String rejectProjects(@PathVariable("projectId") int projectId) {
		Project project = projectService.findByProjectId(projectId);
		project.setAdminComments("");
		project.setStatusId(3);
		projectService.save(project);
		return Constants.SUCCESS;
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
		return Constants.SUCCESS;
	}
	
	
}

	

