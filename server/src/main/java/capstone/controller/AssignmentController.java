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

import capstone.model.Project;
import capstone.model.assignment.Task;
import capstone.model.assignment.WeeklyReport;
import capstone.model.users.Student;
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
		System.out.println("Received HTTP POST");
		String timeStamp = new SimpleDateFormat("yyyy:MM:dd:HH:mm:ss").format(new Date());

		System.out.println(timeStamp);
		System.out.println(info.get("email"));
		Student s = userService.findStudentByEmail(info.get("email"));
		Project p = userService.getStudentProject(s);

		WeeklyReport wr = new WeeklyReport();
		wr.setStudent(s);
		wr.setProject(p);
		wr.semester = 2019; 
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
	// Stakeholder view of the weekly reports
	@GetMapping("getweeklyreport/{semester}/{fallspring}")
	@CrossOrigin
	public Collection<WeeklyReport> getWeeklyReportsforStakeholder(@PathVariable("semester") int semester, @PathVariable("fallspring") int fallspring)
	{
		List<WeeklyReport> weeklyReports = (List<WeeklyReport>) assignmentService.getWeeklyReports();
		// List<WeeklyReport> validReports = new ArrayList<WeeklyReport>();
		// for (WeeklyReport wr: weeklyReports) {
		// 	//TO DO: parse by Semester
		// }
		return weeklyReports; 
	}

	/* Peer Reviews */
	// TO DO 
}
