package capstone.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.util.bcel.classfile.Constant;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import capstone.model.Global;
import capstone.model.Project;
import capstone.model.assignment.Task;
import capstone.model.assignment.WeeklyReport;
import capstone.model.users.Stakeholder;
import capstone.model.users.Student;
import capstone.repository.GlobalRepository;

import capstone.repository.TaskRepository;
import capstone.repository.WeeklyReportRepository;
import capstone.service.AssignmentService;
import capstone.service.EmailService;
import capstone.service.UserService;
import capstone.util.Constants;

/*
 * This controller is a WIP. Deliverables has to still created
 */
@RestController
@RequestMapping("assignment")
public class AssignmentController {
	@Autowired
	private UserService userService;
	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private GlobalRepository globalRepo;
	@Autowired
	private WeeklyReportRepository weeklyRepo;
	@Autowired
	private EmailService emailService;

	public AssignmentController() {
	}

	/* Deliverables */
	 // TO DO

	/* Weekly Status Reports */
	@PostMapping("/weeklyReportForm")
	@CrossOrigin
	public @ResponseBody String weeklyReportSubmissionAttempt(@RequestBody Map<String, String> info) {
		//Global g = globalRepo.findAll().get(0);
		System.out.println("Received HTTP POST");
		String timeStamp = new SimpleDateFormat("yyyy:MM:dd:HH:mm:ss").format(new Date());
		System.out.println(timeStamp);
		System.out.println(info.get("email"));
		Student s = userService.findStudentByEmail(info.get("email"));
		Project p = userService.getStudentProject(s);

		WeeklyReport wr = new WeeklyReport();
		wr.setStudent(s);
		wr.setProject(p);
		wr.semester = 2020; //g.getSemester();
		wr.fallSpring = 0; //g.getFallSpring(); 
		wr.setSubmitDateTime(timeStamp);
		wr.setDueDate(info.get("dueDate"));
		ArrayList<Task> thisweekTaskList = new ArrayList<>();
		ArrayList<Task> nextweekTaskList = new ArrayList<>();

		for (Object o : (org.json.simple.JSONArray) JSONValue.parse(info.get("thisWeekTaskList"))) {
			JSONObject task = (JSONObject) o;
			Task t = new Task();
			t.setHours((String) task.get("hours"));
			t.setDescription((String) task.get("description"));
			thisweekTaskList.add(t);
		}
		wr.setThisWeekTasks(thisweekTaskList);
		for (Object o : (org.json.simple.JSONArray) JSONValue.parse(info.get("nextWeekTaskList"))) {
			JSONObject task = (JSONObject) o;
			Task t = new Task();
			t.setHours((String) task.get("hours"));
			t.setDescription((String) task.get("description"));
			nextweekTaskList.add(t);
		}
		wr.setNextWeekTasks(nextweekTaskList);
	
		assignmentService.saveAssignment(wr);
		System.out.println("Weekly report saved!");

		return Constants.SUCCESS;
	}
	// Weekly Report endpoint gets all reports based on semester and fallspring
	@GetMapping("getweeklyreportsfromsemester/{semester}/{fallspring}")
	@CrossOrigin
	public Collection<WeeklyReport> getWeeklyReportsFromSemester(@PathVariable("semester") int semester, @PathVariable("fallspring") int fallspring)
	{
		List<WeeklyReport> weeklyReports = (List<WeeklyReport>) assignmentService.getWeeklyReports();
		System.out.println("In the get weekly reports from semester"); 
		System.out.println("semester: " + semester + " value: " + fallspring);		
		List<WeeklyReport> validReports = new ArrayList<WeeklyReport>();
		System.out.println("reports size: " + weeklyReports.size());
		for (WeeklyReport wr : weeklyReports) {

			if (wr.getSemester() == semester && wr.getFallSpring() == fallspring) {
				validReports.add(wr);
			}
		}
		System.out.println("valid reports size: " + validReports.size());
		return validReports; 
	}
	// Weekly Report endpoint gets all reports based on stakeholder
	@GetMapping("getweeklyreportsbystakeholder/{semester}/{email:.+}") 
	@CrossOrigin
	public Collection<WeeklyReport> getWeeklyReportsByStakeholder(@PathVariable("semester") int semester, @PathVariable("email") String email)
	{
		System.out.println("stakeholder email : " + email);
		List<WeeklyReport> weeklyReports = (List<WeeklyReport>) assignmentService.getWeeklyReports();
		Stakeholder user = userService.findStakeholderByEmail(email);
		Collection<Project> projects = user.getProjectIds();
		if (projects == null) {
			System.out.println("Stakeholder does not have projects assigned!");
		}
		List<WeeklyReport> validReports = new ArrayList<WeeklyReport>();
		
		for (Project p : projects) {
			for (WeeklyReport wr : weeklyReports) {
				if (wr.getSemester() == semester && wr.getProject().getProjectId() == p.getProjectId()) {
					validReports.add(wr);
				}
			}
		}
		System.out.println("valid reports size: " + validReports.size());
		return validReports; 
	}

	/* Peer Reviews */
	// TO DO 
}
