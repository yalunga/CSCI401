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
import capstone.model.assignment.DueDate;
import capstone.model.assignment.Task;
import capstone.model.assignment.WeeklyReport;
import capstone.model.users.Stakeholder;
import capstone.model.users.Student;
import capstone.repository.DueDateRepository;
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
	@Autowired 
	private DueDateRepository dueDateRepo;

	public AssignmentController() {
	}

	/* Deliverables */
	 // TO DO

	/* Weekly Status Reports */

	@PostMapping("/weeklyReportForm")
	@CrossOrigin
	public @ResponseBody String weeklyReportSubmissionAttempt(@RequestBody final Map<String, String> info) {
		System.out.println("Received HTTP POST");
		final String timeStamp = new SimpleDateFormat("yyyy:MM:dd:HH:mm:ss").format(new Date());
		System.out.println(timeStamp);
		System.out.println(info.get("email"));
		final Student s = userService.findStudentByEmail(info.get("email"));
		final Project p = userService.getStudentProject(s);

		final WeeklyReport wr = new WeeklyReport();
		wr.setStudent(s);
		wr.setProject(p);
		wr.semester = 2019;
		wr.setSubmitDateTime(timeStamp);
		wr.setDueDate(info.get("dueDate"));
		final ArrayList<Task> thisweekTaskList = new ArrayList<>();
		final ArrayList<Task> nextweekTaskList = new ArrayList<>();

		for (final Object o : (org.json.simple.JSONArray) JSONValue.parse(info.get("thisWeekTaskList"))) {
			final JSONObject task = (JSONObject) o;
			final Task t = new Task();
			t.setHours((String) task.get("hours"));
			t.setDescription((String) task.get("description"));
			thisweekTaskList.add(t);
		}
		wr.setThisWeekTasks(thisweekTaskList);
		for (final Object o : (org.json.simple.JSONArray) JSONValue.parse(info.get("nextWeekTaskList"))) {
			final JSONObject task = (JSONObject) o;
			final Task t = new Task();
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
	public Collection<WeeklyReport> getWeeklyReportsforStakeholder(@PathVariable("semester") final int semester,
			@PathVariable("fallspring") final int fallspring) {
		final List<WeeklyReport> weeklyReports = (List<WeeklyReport>) assignmentService.getWeeklyReports();
		// List<WeeklyReport> validReports = new ArrayList<WeeklyReport>();
		// for (WeeklyReport wr: weeklyReports) {
		// //TO DO: parse by Semester
		// }
		return weeklyReports;
	}

	// Admin side setting due dates
	@PostMapping("/setWeeklyReportDueDates")
	@CrossOrigin
	public @ResponseBody String setWeeklyReportDueDates(@RequestBody final Map<String, String> data) {
		System.out.println("Received HTTP POST for setting due dates");
		final List<String> dueDateStrings = Arrays.asList(data.get("dueDateStrings").split(","));
		final int fallSpring = Integer.parseInt(data.get("fallSpring"));
		final int semester = Integer.parseInt(data.get("semester"));

		try {
			// Clear all old due dates
			dueDateRepo.deleteAll();

			// Save all due dates
			for (final String dueDateString : dueDateStrings) {
				final DueDate dueDate = new DueDate();
				dueDate.setDueDateString(dueDateString);
				dueDate.setSemester(semester);
				dueDate.setFallSpring(fallSpring);
				dueDateRepo.save(dueDate);
			}
			return Constants.SUCCESS;
		} catch (final Exception e) {
			System.out.println("Error setting due dates.");
			e.printStackTrace();
			return Constants.ERROR;
		}
	}

	@GetMapping("/getWeeklyReportDueDates/{semester}/{fallSpring}")
	@CrossOrigin
	public Collection<String> getWeeklyReportDueDates(@PathVariable("semester") final int semester,
	@PathVariable("fallSpring") final int fallSpring) {
		try {
			// Filter by semester and fallSpring
			ArrayList<DueDate> dueDates = dueDateRepo.findBySemesterAndFallSpring(semester, fallSpring);
			ArrayList<String> dueDateStrings = new ArrayList<>();
			for (DueDate dueDate: dueDates) {
				dueDateStrings.add(dueDate.getDueDateSring());
			}

			return dueDateStrings;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Error retrieving due dates");
			return new ArrayList<>();
		}
	}

	/* Peer Reviews */
	// TO DO 
}
